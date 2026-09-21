import { createContext, useCallback, useContext, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

export function GlassToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, opts = {}) => {
    const id = ++idRef.current;
    const toast = { id, message, type: opts.type || "default" };
    setToasts((t) => [...t, toast]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, opts.duration || 2200);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {createPortal(
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: 100,
            alignItems: "center"
          }}
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className="nx-glass-card"
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                color: t.type === "error" ? "#ff8686" : "var(--nx-ink)",
                animation: "nx-toast-in 180ms ease"
              }}
            >
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}
      <style>{`@keyframes nx-toast-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within GlassToastProvider");
  return ctx;
}
