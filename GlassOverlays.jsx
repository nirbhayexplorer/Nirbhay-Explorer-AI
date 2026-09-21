import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ---------- GlassModal ---------- */
export function GlassModal({ open, onClose, title, children, footer, closeOnBackdrop = true }) {
  if (!open) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px"
      }}
    >
      <div
        onClick={closeOnBackdrop ? onClose : undefined}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(5,6,8,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: "nx-fade-in 200ms ease"
        }}
      />
      <div
        className="nx-glass-card"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "480px",
          padding: "24px",
          animation: "nx-modal-in 220ms cubic-bezier(.4,0,.2,1)"
        }}
      >
        {title && <h2 style={{ margin: "0 0 14px", fontSize: "18px", fontWeight: 650 }}>{title}</h2>}
        {children}
        {footer && <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>{footer}</div>}
      </div>
      <style>{`
        @keyframes nx-fade-in{from{opacity:0}to{opacity:1}}
        @keyframes nx-modal-in{from{opacity:0;transform:scale(0.96) translateY(6px)}to{opacity:1;transform:scale(1) translateY(0)}}
      `}</style>
    </div>,
    document.body
  );
}

/* ---------- GlassDrawer (mobile hamburger menu) ---------- */
export function GlassDrawer({ open, onClose, side = "left", children }) {
  if (!open) return null;
  const fromSide = side === "left" ? "translateX(-100%)" : "translateX(100%)";
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 70 }}>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(5,6,8,0.5)", backdropFilter: "blur(4px)" }}
      />
      <div
        className="nx-glass-card"
        style={{
          position: "absolute",
          top: 0, bottom: 0, [side]: 0,
          width: "82%", maxWidth: "320px",
          borderRadius: 0,
          padding: "18px",
          paddingTop: "calc(18px + env(safe-area-inset-top, 0px))",
          paddingBottom: "calc(18px + env(safe-area-inset-bottom, 0px))",
          animation: `nx-drawer-in 240ms cubic-bezier(.4,0,.2,1)`,
          overflowY: "auto"
        }}
      >
        {children}
      </div>
      <style>{`
        @keyframes nx-drawer-in{from{transform:${fromSide}}to{transform:translateX(0)}}
      `}</style>
    </div>,
    document.body
  );
}

/* ---------- GlassDropdown / GlassMenu (three-dot menus) ---------- */
export function GlassMenu({ trigger, items, align = "end" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span onClick={() => setOpen((v) => !v)}>{trigger}</span>
      {open && (
        <div
          role="menu"
          className="nx-glass-card"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            [align === "end" ? "right" : "left"]: 0,
            minWidth: "170px",
            padding: "6px",
            zIndex: 30,
            animation: "nx-menu-in 140ms ease"
          }}
        >
          {items
            .filter((it) => it.show !== false)
            .map((it, i) =>
              it.divider ? (
                <div key={i} style={{ height: 1, background: "var(--nx-border)", margin: "5px 4px" }} />
              ) : (
                <button
                  key={i}
                  role="menuitem"
                  className="nx-focus-ring"
                  onClick={() => { setOpen(false); it.onSelect?.(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "9px",
                    width: "100%", textAlign: "left",
                    background: "transparent", border: "none",
                    color: it.danger ? "#ff6b6b" : "var(--nx-ink)",
                    fontSize: "13px", fontFamily: "inherit",
                    padding: "9px 10px", borderRadius: "var(--nx-radius-sm)",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--nx-glass-strong)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  {it.icon}
                  {it.label}
                </button>
              )
            )}
        </div>
      )}
      <style>{`@keyframes nx-menu-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
