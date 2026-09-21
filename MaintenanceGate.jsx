import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { GlassCard, GlassButton } from "./glass/GlassPrimitives";
import logo from "../assets/logo/nirbhay-logo.png";

export default function MaintenanceGate({ children }) {
  const { isAdmin, adminChecked } = useAuth();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Live-syncs from maintenance/config so the popup appears/disappears
    // without a page reload (spec section 21 & 41).
    const unsub = onSnapshot(doc(db, "maintenance", "config"), (snap) => {
      setConfig(snap.exists() ? snap.data() : { enabled: false });
    }, () => setConfig({ enabled: false }));
    return unsub;
  }, []);

  // Wait for both the maintenance flag and the admin-claim check before
  // deciding — otherwise an admin could briefly see the maintenance
  // screen while their token is still resolving.
  if (config === null || !adminChecked) return children;
  if (!config.enabled || isAdmin) return children;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ position: "absolute", inset: 0, background: "var(--nx-bg-0)" }} />
      <GlassCard
        style={{
          position: "relative", width: "100%", maxWidth: "420px", padding: "34px 28px",
          textAlign: "center", animation: "nx-maint-in 320ms cubic-bezier(.4,0,.2,1)"
        }}
      >
        <img src={logo} alt="Nirbhay Explorer AI" style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", margin: "0 auto 18px" }} />
        <h1 style={{ fontSize: "18px", fontWeight: 650, margin: "0 0 8px" }}>{config.title || "Service Under Development"}</h1>
        <p style={{ fontSize: "13.5px", color: "var(--nx-ink-dim)", lineHeight: 1.6, margin: "0 0 6px" }}>
          {config.message || "This service is currently under development. Please check back later."}
        </p>
        {config.secondaryMessage && (
          <p style={{ fontSize: "12.5px", color: "var(--nx-ink-faint)", margin: "0 0 18px" }}>{config.secondaryMessage}</p>
        )}
        <GlassButton onClick={() => location.reload()} style={{ marginTop: "16px" }}>
          {config.buttonText || "Check again"}
        </GlassButton>
      </GlassCard>
      <style>{`@keyframes nx-maint-in{from{opacity:0;filter:blur(6px);transform:scale(0.97)}to{opacity:1;filter:blur(0);transform:scale(1)}}`}</style>
    </div>
  );
}
