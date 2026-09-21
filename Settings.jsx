import { useState } from "react";
import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme, ACCENT_OPTIONS } from "../context/ThemeContext";
import { useReadAloud } from "../hooks/useReadAloud";
import { GlassCard, GlassButton } from "../components/glass/GlassPrimitives";

function Section({ title, children }) {
  return (
    <GlassCard style={{ padding: "20px 22px" }}>
      <h3 style={{ margin: "0 0 14px", fontSize: "14.5px", fontWeight: 650 }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>{children}</div>
    </GlassCard>
  );
}

const ACCENT_HEX = {
  blue: "#3b7cf5", indigo: "#5b63e0", purple: "#8b5cf6", violet: "#a855f7",
  pink: "#e0559c", rose: "#e1425e", red: "#e0342f", orange: "#e2793a",
  amber: "#d99a2b", yellow: "#c9a92a", lime: "#8dbf3d", green: "#3fa564",
  emerald: "#2fae7f", teal: "#2ba9a0", cyan: "#2ca7cf", sky: "#3b93f7",
  slate: "#64748b", graphite: "#5a5f68", ocean: "#2673a8", aurora: "#3aa9a0"
};

function Row({ label, sub, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
      <div>
        <div style={{ fontSize: "13.5px" }}>{label}</div>
        {sub && <div style={{ fontSize: "11.5px", color: "var(--nx-ink-faint)", marginTop: "2px" }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="nx-focus-ring"
      style={{
        width: 42, height: 24, borderRadius: "999px", border: "1px solid var(--nx-border)",
        background: on ? "var(--nx-accent)" : "var(--nx-border-strong)", position: "relative",
        cursor: "pointer", flex: "none"
      }}
    >
      <span
        style={{
          position: "absolute", top: 2, left: on ? 20 : 2,
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          transition: "left 180ms ease"
        }}
      />
    </button>
  );
}

export default function Settings() {
  const { theme, setTheme, accent, setAccent, density, setDensity } = useTheme();
  const { voices } = useReadAloud();

  const [enterToSend, setEnterToSend] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(true);

  const [readAloud, setReadAloud] = useState(true);
  const [autoReadAloud, setAutoReadAloud] = useState(false);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);

  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [notifSound, setNotifSound] = useState(true);
  const [toastNotifs, setToastNotifs] = useState(true);

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "28px 20px 60px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 650, margin: "0 0 4px" }}>Settings</h1>

      <Section title="Appearance">
        <Row label="Theme">
          <div className="nx-glass-surface" style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "999px" }}>
            {[
              { key: "light", icon: <Sun size={14} /> },
              { key: "system", icon: <Monitor size={14} /> },
              { key: "dark", icon: <Moon size={14} /> }
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className="nx-focus-ring"
                style={{
                  width: 32, height: 32, borderRadius: "999px", border: "none", cursor: "pointer",
                  background: theme === t.key ? "var(--nx-glass-strong)" : "transparent",
                  color: theme === t.key ? "var(--nx-accent)" : "var(--nx-ink-dim)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                {t.icon}
              </button>
            ))}
          </div>
        </Row>

        <Row label="Accent color" sub="Applied to buttons, links, focus rings and highlights">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", maxWidth: "230px", justifyContent: "flex-end" }}>
            {ACCENT_OPTIONS.map((a) => (
              <button
                key={a}
                aria-label={a}
                onClick={() => setAccent(a)}
                className="nx-focus-ring"
                style={{
                  width: 20, height: 20, borderRadius: "50%", cursor: "pointer",
                  border: accent === a ? "2px solid var(--nx-ink)" : "1px solid var(--nx-border)",
                  background: ACCENT_HEX[a]
                }}
              />
            ))}
          </div>
        </Row>

        <Row label="UI density">
          <div className="nx-glass-surface" style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "999px" }}>
            {["comfortable", "compact"].map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className="nx-focus-ring"
                style={{
                  padding: "6px 12px", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "12px",
                  background: density === d ? "var(--nx-glass-strong)" : "transparent",
                  color: density === d ? "var(--nx-ink)" : "var(--nx-ink-dim)"
                }}
              >
                {d === "comfortable" ? "Comfortable" : "Compact"}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      <Section title="Chat">
        <Row label="Enter to send" sub="Shift + Enter always adds a new line"><Toggle on={enterToSend} onChange={setEnterToSend} /></Row>
        <Row label="Show timestamps"><Toggle on={showTimestamps} onChange={setShowTimestamps} /></Row>
        <Row label="Auto-scroll to latest message"><Toggle on={autoScroll} onChange={setAutoScroll} /></Row>
        <Row label="Confirm before deleting"><Toggle on={confirmDelete} onChange={setConfirmDelete} /></Row>
      </Section>

      <Section title="Audio">
        <Row label="Read aloud" sub="Enable the read-aloud action on AI responses"><Toggle on={readAloud} onChange={setReadAloud} /></Row>
        <Row label="Auto read aloud" sub="Speak new AI replies automatically"><Toggle on={autoReadAloud} onChange={setAutoReadAloud} /></Row>
        <Row label="Voice" sub={voices.length ? `${voices.length} voices available` : "Loading voices…"}>
          <select
            className="nx-focus-ring"
            style={{ background: "rgba(0,0,0,0.14)", border: "1px solid var(--nx-border)", color: "var(--nx-ink)", borderRadius: "var(--nx-radius-sm)", padding: "8px 10px", fontSize: "12.5px", fontFamily: "inherit" }}
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>{v.name}{/Microsoft/i.test(v.name) && /Online/i.test(v.name) ? " · Microsoft Online" : ""}</option>
            ))}
          </select>
        </Row>
        <Row label="Speech rate">
          <input type="range" min="0.5" max="2" step="0.05" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} style={{ width: 140 }} />
        </Row>
        <Row label="Volume">
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: 140 }} />
        </Row>
      </Section>

      <Section title="Notifications">
        <Row label="In-app notifications"><Toggle on={inAppNotifs} onChange={setInAppNotifs} /></Row>
        <Row label="Notification sound"><Toggle on={notifSound} onChange={setNotifSound} /></Row>
        <Row label="Toast notifications"><Toggle on={toastNotifs} onChange={setToastNotifs} /></Row>
      </Section>

      <Section title="Privacy">
        <Row label="Clear local UI preferences" sub="Resets theme, accent and density on this device">
          <GlassButton size="sm" onClick={() => { localStorage.clear(); location.reload(); }}>Clear</GlassButton>
        </Row>
      </Section>

      <Section title="About">
        <Row label="App version"><span style={{ fontSize: "12.5px", color: "var(--nx-ink-faint)" }}>0.1.0</span></Row>
        <Row label="Nirbhay Explorer AI"><span style={{ fontSize: "12.5px", color: "var(--nx-ink-faint)" }}>Production scaffold</span></Row>
      </Section>
    </div>
  );
}
