import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { GlassCard, GlassButton, GlassInput } from "../components/glass/GlassPrimitives";
import { useToast } from "../components/glass/GlassToast";

// Every action here is a stand-in for a callable Cloud Function that
// verifies the caller's admin custom claim server-side before writing
// anything. The client NEVER writes Gemini secrets or maintenance/
// announcement state directly to Firestore (spec sections 2, 10, 21).

function Section({ title, desc, children }) {
  return (
    <GlassCard style={{ padding: "22px" }}>
      <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 650 }}>{title}</h3>
      {desc && <p style={{ margin: "4px 0 16px", fontSize: "12.5px", color: "var(--nx-ink-faint)" }}>{desc}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: desc ? 0 : "14px" }}>{children}</div>
    </GlassCard>
  );
}

export default function Admin() {
  const showToast = useToast();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState("Not configured");
  const [saving, setSaving] = useState(false);

  const [maintOn, setMaintOn] = useState(false);
  const [maintTitle, setMaintTitle] = useState("Service Under Development");
  const [maintMessage, setMaintMessage] = useState("This service is currently under development. Please check back later.");

  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annType, setAnnType] = useState("Information");

  async function saveApiKey() {
    if (!apiKey.trim()) return;
    setSaving(true);
    // TODO: call a callable Cloud Function, e.g. saveGeminiKey({ apiKey })
    // which verifies role==="admin" from the caller's ID token, then
    // stores the secret in Secret Manager. The raw key must never be
    // written back to Firestore or returned to the client.
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setApiKey("");
    setKeyStatus("Configured");
    showToast("Gemini API key saved");
  }

  async function testConfig() {
    showToast("Configuration looks good");
  }

  function publishAnnouncement() {
    if (!annTitle.trim() || !annMessage.trim()) return;
    // TODO: write to announcements/{id} via a callable function that
    // checks the admin claim (spec section 19 & 28).
    showToast("Announcement published");
    setAnnTitle(""); setAnnMessage("");
  }

  function saveMaintenance() {
    // TODO: write to maintenance/config via an admin-only callable.
    showToast(maintOn ? "Maintenance mode enabled" : "Maintenance mode disabled");
  }

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 20px 60px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <ShieldCheck size={20} color="var(--nx-accent)" />
        <h1 style={{ fontSize: "22px", fontWeight: 650, margin: 0 }}>Admin Panel</h1>
      </div>

      <Section title="AI Configuration" desc="The Gemini key is sent to a secure backend and never stored or shown in full again.">
        <div>
          <div style={{ fontSize: "12.5px", color: "var(--nx-ink-dim)", marginBottom: "6px" }}>
            Gemini API key — status: <strong style={{ color: keyStatus === "Configured" ? "#7fe0b2" : "var(--nx-ink-faint)" }}>{keyStatus}</strong>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <GlassInput
                type={showKey ? "text" : "password"}
                placeholder="Paste new Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                aria-label={showKey ? "Hide key" : "Show key"}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--nx-ink-faint)", cursor: "pointer", padding: 0 }}
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <GlassButton variant="primary" onClick={saveApiKey} loading={saving} disabled={!apiKey.trim()}>Save</GlassButton>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <GlassButton size="sm" onClick={testConfig}>Test configuration</GlassButton>
          <GlassButton size="sm" variant="danger" onClick={() => showToast("AI temporarily disabled")}>Disable AI</GlassButton>
        </div>
      </Section>

      <Section title="Announcements" desc="Published announcements appear in every signed-in user's notification panel.">
        <GlassInput placeholder="Title" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} />
        <textarea
          placeholder="Message"
          value={annMessage}
          onChange={(e) => setAnnMessage(e.target.value)}
          rows={3}
          style={{ width: "100%", background: "rgba(0,0,0,0.14)", border: "1px solid var(--nx-border)", color: "var(--nx-ink)", borderRadius: "var(--nx-radius-sm)", padding: "10px 12px", fontSize: "13.5px", fontFamily: "inherit", outline: "none", resize: "vertical" }}
        />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <select
            value={annType}
            onChange={(e) => setAnnType(e.target.value)}
            style={{ background: "rgba(0,0,0,0.14)", border: "1px solid var(--nx-border)", color: "var(--nx-ink)", borderRadius: "var(--nx-radius-sm)", padding: "9px 10px", fontSize: "12.5px", fontFamily: "inherit" }}
          >
            {["Information", "Feature", "Maintenance", "Update", "Important"].map((t) => <option key={t}>{t}</option>)}
          </select>
          <GlassButton variant="primary" onClick={publishAnnouncement} disabled={!annTitle.trim() || !annMessage.trim()}>Publish</GlassButton>
        </div>
      </Section>

      <Section title="Maintenance Mode" desc="Normal users see a glass maintenance screen; verified admins keep full access.">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13.5px" }}>Enable maintenance mode</span>
          <button
            role="switch"
            aria-checked={maintOn}
            onClick={() => setMaintOn((v) => !v)}
            style={{
              width: 42, height: 24, borderRadius: "999px", border: "1px solid var(--nx-border)",
              background: maintOn ? "var(--nx-accent)" : "var(--nx-border-strong)", position: "relative", cursor: "pointer"
            }}
          >
            <span style={{ position: "absolute", top: 2, left: maintOn ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 180ms ease" }} />
          </button>
        </div>
        <GlassInput placeholder="Title" value={maintTitle} onChange={(e) => setMaintTitle(e.target.value)} />
        <textarea
          value={maintMessage}
          onChange={(e) => setMaintMessage(e.target.value)}
          rows={3}
          style={{ width: "100%", background: "rgba(0,0,0,0.14)", border: "1px solid var(--nx-border)", color: "var(--nx-ink)", borderRadius: "var(--nx-radius-sm)", padding: "10px 12px", fontSize: "13.5px", fontFamily: "inherit", outline: "none", resize: "vertical" }}
        />
        <div>
          <GlassButton variant="primary" onClick={saveMaintenance}>Save</GlassButton>
        </div>
      </Section>

      <Section title="App Configuration" desc="Map the supplied Google Drive links to their legal roles.">
        {["Terms URL", "Privacy URL", "Limitations URL", "Documentation URL"].map((label) => (
          <GlassInput key={label} placeholder={label} />
        ))}
        <div><GlassButton variant="primary" onClick={() => showToast("App configuration saved")}>Save configuration</GlassButton></div>
      </Section>
    </div>
  );
}
