import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "./glass/GlassPrimitives";

function CenteredSpinner() {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--nx-ink-faint)" }}>
      <Spinner size={22} />
    </div>
  );
}

export function RequireAuth({ children }) {
  const { user } = useAuth();
  if (user === undefined) return <CenteredSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Frontend route hiding is convenience only — the real check happens
// server-side (Firestore Security Rules + Cloud Function role checks).
// This just avoids rendering the Admin UI in the DOM for non-admins,
// and never reveals *why* access was denied (spec section 56).
export function RequireAdmin({ children }) {
  const { user, isAdmin, adminChecked } = useAuth();
  if (user === undefined || !adminChecked) return <CenteredSpinner />;
  if (!user || !isAdmin) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
        <div style={{ fontSize: "16px", fontWeight: 650 }}>Access denied</div>
        <div style={{ fontSize: "13px", color: "var(--nx-ink-faint)" }}>You don't have permission to view this page.</div>
      </div>
    );
  }
  return children;
}
