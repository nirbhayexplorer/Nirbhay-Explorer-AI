import { forwardRef } from "react";

/* ---------- GlassCard ---------- */
export function GlassCard({ as: Tag = "div", className = "", style, children, ...rest }) {
  return (
    <Tag
      className={`nx-card ${className}`}
      style={{
        background: "var(--nx-glass)",
        border: "1px solid var(--nx-border)",
        borderRadius: "var(--nx-radius-lg)",
        backdropFilter: "blur(22px) saturate(140%)",
        WebkitBackdropFilter: "blur(22px) saturate(140%)",
        boxShadow: "var(--nx-shadow-card)",
        ...style
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ---------- GlassButton ---------- */
export const GlassButton = forwardRef(function GlassButton(
  { variant = "default", size = "md", icon, iconRight, loading, children, className = "", disabled, ...rest },
  ref
) {
  const base = {
    appearance: "none",
    border: "1px solid var(--nx-border-strong)",
    background: "var(--nx-glass-strong)",
    color: "var(--nx-ink)",
    fontFamily: "inherit",
    fontWeight: 560,
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "transform 120ms ease, background 150ms ease, border-color 150ms ease, opacity 150ms ease",
    fontSize: size === "sm" ? "12.5px" : size === "lg" ? "15px" : "13.5px",
    padding: size === "sm" ? "7px 13px" : size === "lg" ? "13px 22px" : "10px 16px"
  };

  const variants = {
    default: {},
    primary: {
      background: "linear-gradient(180deg, var(--nx-accent), color-mix(in srgb, var(--nx-accent) 78%, black))",
      borderColor: "transparent",
      color: "#fff",
      boxShadow: "0 8px 20px -8px var(--nx-accent-glow)"
    },
    ghost: { background: "transparent", borderColor: "transparent" },
    danger: {
      background: "rgba(225,29,46,0.14)",
      borderColor: "rgba(225,29,46,0.35)",
      color: "#ff6b6b"
    },
    icon: {
      background: "var(--nx-glass-strong)",
      borderRadius: "999px",
      width: size === "sm" ? "30px" : "36px",
      height: size === "sm" ? "30px" : "36px",
      padding: 0
    }
  };

  return (
    <button
      ref={ref}
      className={`nx-focus-ring ${className}`}
      style={{ ...base, ...variants[variant] }}
      disabled={disabled || loading}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {loading ? <Spinner size={size === "sm" ? 12 : 14} /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
});

/* ---------- GlassInput ---------- */
export const GlassInput = forwardRef(function GlassInput({ className = "", style, ...rest }, ref) {
  return (
    <input
      ref={ref}
      className={`nx-focus-ring ${className}`}
      style={{
        width: "100%",
        background: "rgba(0,0,0,0.14)",
        border: "1px solid var(--nx-border)",
        color: "var(--nx-ink)",
        borderRadius: "var(--nx-radius-sm)",
        padding: "12px 14px",
        fontSize: "14px",
        fontFamily: "inherit",
        outline: "none",
        ...style
      }}
      {...rest}
    />
  );
});

/* ---------- small spinner used for loading states ---------- */
export function Spinner({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "nx-spin 0.8s linear infinite" }}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <style>{"@keyframes nx-spin{to{transform:rotate(360deg)}}"}</style>
    </svg>
  );
}
