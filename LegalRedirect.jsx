import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { GlassCard, GlassButton, Spinner } from "../components/glass/GlassPrimitives";

const FIELD_BY_KIND = {
  terms: "termsUrl",
  privacy: "privacyUrl",
  limitations: "limitationsUrl",
  documentation: "documentationUrl"
};

const LABEL_BY_KIND = {
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  limitations: "Limitations",
  documentation: "Documentation"
};

// Opens the Google Drive link the admin has mapped for this legal
// document. Links are configurable centrally (appConfig/legal) rather
// than hard-coded, since the three supplied Drive URLs were not
// pre-labeled (spec sections 25 & 49).
export default function LegalRedirect({ kind }) {
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    getDoc(doc(db, "appConfig", "legal"))
      .then((snap) => setUrl(snap.exists() ? snap.data()[FIELD_BY_KIND[kind]] : ""))
      .catch(() => setUrl(""));
  }, [kind]);

  useEffect(() => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }, [url]);

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <GlassCard style={{ padding: "28px", maxWidth: "380px", textAlign: "center" }}>
        {url === undefined && <Spinner size={22} />}
        {url === "" && (
          <p style={{ fontSize: "13.5px", color: "var(--nx-ink-dim)" }}>
            {LABEL_BY_KIND[kind]} hasn't been configured yet. An admin can set this under App Configuration.
          </p>
        )}
        {url && (
          <>
            <p style={{ fontSize: "13.5px", color: "var(--nx-ink-dim)", marginBottom: "14px" }}>
              Opening {LABEL_BY_KIND[kind]} in a new tab…
            </p>
            <GlassButton onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>Open again</GlassButton>
          </>
        )}
      </GlassCard>
    </div>
  );
}
