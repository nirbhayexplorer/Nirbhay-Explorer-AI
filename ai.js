const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const secretClient = new SecretManagerServiceClient();
const SECRET_NAME = "gemini-api-key"; // create once: gcloud secrets create gemini-api-key

function requireAdmin(context) {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin access required.");
  }
}

function requireAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Sign in required.");
  }
}

async function getLatestSecretValue() {
  const projectId = process.env.GCLOUD_PROJECT;
  const [version] = await secretClient.accessSecretVersion({
    name: `projects/${projectId}/secrets/${SECRET_NAME}/versions/latest`
  });
  return version.payload.data.toString("utf8");
}

/**
 * Admin-only. Stores a new Gemini key in Secret Manager and writes only
 * non-secret status metadata to Firestore. The raw key is never
 * returned to any client after this call (spec section 30).
 */
exports.saveGeminiKey = functions.https.onCall(async (data, context) => {
  requireAdmin(context);
  const apiKey = (data?.apiKey || "").trim();
  if (!apiKey) throw new functions.https.HttpsError("invalid-argument", "Missing API key.");

  const projectId = process.env.GCLOUD_PROJECT;
  const parent = `projects/${projectId}/secrets/${SECRET_NAME}`;
  await secretClient.addSecretVersion({
    parent,
    payload: { data: Buffer.from(apiKey, "utf8") }
  });

  await admin.firestore().doc("appConfig/ai").set(
    { configured: true, updatedAt: admin.firestore.FieldValue.serverTimestamp(), updatedBy: context.auth.uid },
    { merge: true }
  );

  return { status: "Configured" };
});

exports.testGeminiConfig = functions.https.onCall(async (data, context) => {
  requireAdmin(context);
  try {
    await getLatestSecretValue();
    return { ok: true };
  } catch (err) {
    return { ok: false, message: "No valid Gemini key is configured yet." };
  }
});

/**
 * Rate limiting: a simple per-user sliding window kept in Firestore.
 * Swap for a proper limiter (e.g. Firestore transaction counter or an
 * external store) before production traffic (spec section 32).
 */
async function checkRateLimit(uid) {
  const ref = admin.firestore().doc(`rateLimits/${uid}`);
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxPerWindow = 20;

  await admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : { count: 0, windowStart: now };
    const withinWindow = now - data.windowStart < windowMs;
    const nextCount = withinWindow ? data.count + 1 : 1;

    if (withinWindow && nextCount > maxPerWindow) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "Too many requests. Please wait a moment and try again."
      );
    }
    tx.set(ref, { count: nextCount, windowStart: withinWindow ? data.windowStart : now });
  });
}

/**
 * Callable chat endpoint. The browser never sees the Gemini key — this
 * function retrieves it from Secret Manager, calls Gemini, and returns
 * only the generated reply (spec sections 9 & 31).
 */
exports.chatWithGemini = functions.https.onCall(async (data, context) => {
  requireAuth(context);
  await checkRateLimit(context.auth.uid);

  const message = (data?.message || "").toString().slice(0, 8000);
  if (!message.trim()) {
    throw new functions.https.HttpsError("invalid-argument", "Message is empty.");
  }

  let apiKey;
  try {
    apiKey = await getLatestSecretValue();
  } catch {
    throw new functions.https.HttpsError("failed-precondition", "AI is not configured yet.");
  }

  const model = data?.model || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: message }] }] })
  });

  if (!response.ok) {
    throw new functions.https.HttpsError("internal", "The AI service is temporarily unavailable.");
  }

  const json = await response.json();
  const reply = json?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";

  // Store the exchange under the user's own conversation subtree only
  // (spec section 27) — omitted here since it needs a conversationId
  // from the client; wire this up once conversations are created.

  return { reply };
});
