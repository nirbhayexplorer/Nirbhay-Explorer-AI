const functions = require("firebase-functions");
const admin = require("firebase-admin");

function requireAdmin(context) {
  if (!context.auth || context.auth.token.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin access required.");
  }
}

exports.publishAnnouncement = functions.https.onCall(async (data, context) => {
  requireAdmin(context);
  const { title, message, type, startAt, endAt } = data || {};
  if (!title || !message) {
    throw new functions.https.HttpsError("invalid-argument", "Title and message are required.");
  }

  const ref = admin.firestore().collection("announcements").doc();
  await ref.set({
    title,
    message,
    type: type || "Information",
    active: true,
    publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: endAt || null,
    startAt: startAt || null,
    createdBy: context.auth.uid,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { id: ref.id };
});

exports.setMaintenanceMode = functions.https.onCall(async (data, context) => {
  requireAdmin(context);
  const { enabled, title, message, secondaryMessage, buttonText } = data || {};

  await admin.firestore().doc("maintenance/config").set(
    {
      enabled: !!enabled,
      title: title || "Service Under Development",
      message: message || "This service is currently under development. Please check back later.",
      secondaryMessage: secondaryMessage || "",
      buttonText: buttonText || "Check again",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: context.auth.uid
    },
    { merge: true }
  );

  return { ok: true };
});
