import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { GlassToastProvider } from "./components/glass/GlassToast";
import { RequireAuth, RequireAdmin } from "./components/RouteGuards";
import MaintenanceGate from "./components/MaintenanceGate";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import LegalRedirect from "./pages/LegalRedirect";

function RootRedirect() {
  const { user } = useAuth();
  if (user === undefined) return null;
  return <Navigate to={user ? "/chat" : "/login"} replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <GlassToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <div style={{ height: "100dvh" }}>
              <MaintenanceGate>
                <Routes>
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
                  <Route path="/chat/:conversationId" element={<RequireAuth><Chat /></RequireAuth>} />
                  <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
                  <Route path="/terms" element={<RequireAuth><LegalRedirect kind="terms" /></RequireAuth>} />
                  <Route path="/privacy" element={<RequireAuth><LegalRedirect kind="privacy" /></RequireAuth>} />
                  <Route path="/limitations" element={<RequireAuth><LegalRedirect kind="limitations" /></RequireAuth>} />
                  <Route path="/documentation" element={<RequireAuth><LegalRedirect kind="documentation" /></RequireAuth>} />
                  <Route path="/about" element={<RequireAuth><Settings /></RequireAuth>} />
                  <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MaintenanceGate>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </GlassToastProvider>
    </ThemeProvider>
  );
}
