import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GlassCard, GlassButton, GlassInput, Spinner } from "../components/glass/GlassPrimitives";
import logo from "../assets/logo/nirbhay-logo.png";

export default function Login() {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setNotice(""); setLoading(true);
    const result = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (result.ok) navigate("/chat");
    else setError(result.message);
  }

  async function handleGoogle() {
    setError(""); setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    if (result.ok) navigate("/chat");
    else setError(result.message);
  }

  async function handleForgotPassword() {
    if (!email) { setError("Enter your email above first, then tap forgot password."); return; }
    setError(""); setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.ok) setNotice("Password reset email sent — check your inbox.");
    else setError(result.message);
  }

  return (
    <div
      style={{
        minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px"
      }}
    >
      <GlassCard style={{ width: "100%", maxWidth: "380px", padding: "32px 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
          <img
            src={logo}
            alt="Nirbhay Explorer AI logo"
            style={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid var(--nx-border-strong)", background: "#fff" }}
          />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "17px", fontWeight: 650 }}>Nirbhay Explorer AI</div>
            <div style={{ fontSize: "12.5px", color: "var(--nx-ink-faint)", marginTop: "2px" }}>
              {mode === "signin" ? "Sign in to continue" : "Create your account"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <GlassInput
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <GlassInput
            type="password"
            placeholder="Password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div style={{ fontSize: "12.5px", color: "#ff8686", background: "rgba(225,29,46,0.1)", border: "1px solid rgba(225,29,46,0.25)", borderRadius: "var(--nx-radius-sm)", padding: "9px 11px" }}>
              {error}
            </div>
          )}
          {notice && (
            <div style={{ fontSize: "12.5px", color: "#7fe0b2", background: "rgba(62,207,142,0.1)", border: "1px solid rgba(62,207,142,0.25)", borderRadius: "var(--nx-radius-sm)", padding: "9px 11px" }}>
              {notice}
            </div>
          )}

          <GlassButton type="submit" variant="primary" size="lg" loading={loading} style={{ width: "100%", marginTop: "4px" }}>
            {mode === "signin" ? "Sign in" : "Create account"}
          </GlassButton>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--nx-border)" }} />
          <span style={{ fontSize: "11.5px", color: "var(--nx-ink-faint)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--nx-border)" }} />
        </div>

        <GlassButton onClick={handleGoogle} loading={loading} style={{ width: "100%" }}>
          Continue with Google
        </GlassButton>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "18px", fontSize: "12.5px" }}>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            style={{ background: "none", border: "none", color: "var(--nx-accent)", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
          >
            {mode === "signin" ? "Create an account" : "Have an account? Sign in"}
          </button>
          {mode === "signin" && (
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{ background: "none", border: "none", color: "var(--nx-ink-faint)", cursor: "pointer", padding: 0, fontFamily: "inherit" }}
            >
              Forgot password?
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
