import { useState } from "react";
import { Copy, Volume2, Square, Share2, Camera, MoreVertical, Pencil, Trash2, RefreshCw, Bot, User } from "lucide-react";
import { GlassMenu } from "./glass/GlassOverlays";
import { useToast } from "./glass/GlassToast";

export default function ChatMessage({ role, content, onEdit, onDelete, onRegenerate, speaking, onReadAloud, onStopReading }) {
  const isUser = role === "user";
  const showToast = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      showToast("Copied");
    } catch {
      showToast("Could not copy", { type: "error" });
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try { await navigator.share({ text: content }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(content);
      showToast("Link sharing isn't supported here — copied text instead");
    }
  }

  return (
    <div style={{ display: "flex", gap: "10px", flexDirection: isUser ? "row-reverse" : "row", maxWidth: "760px", margin: "0 auto 16px" }}>
      <div
        style={{
          width: 30, height: 30, borderRadius: "50%", flex: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isUser ? "var(--nx-glass-strong)" : "var(--nx-accent)",
          color: isUser ? "var(--nx-ink-dim)" : "#fff"
        }}
      >
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: isUser ? "flex-end" : "flex-start", flex: 1, minWidth: 0 }}>
        {editing ? (
          <div style={{ width: "100%" }}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              style={{
                width: "100%", background: "rgba(0,0,0,0.14)", border: "1px solid var(--nx-accent)",
                color: "var(--nx-ink)", borderRadius: "var(--nx-radius-md)", padding: "10px 12px",
                fontSize: "14px", fontFamily: "inherit", outline: "none", resize: "vertical"
              }}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "6px" }}>
              <button onClick={() => setEditing(false)} style={ghostBtn}>Cancel</button>
              <button
                onClick={() => { setEditing(false); onEdit?.(draft); }}
                style={{ ...ghostBtn, background: "var(--nx-accent)", color: "#fff", borderColor: "transparent" }}
              >
                Resubmit
              </button>
            </div>
            <div style={{ fontSize: "11px", color: "var(--nx-ink-faint)", marginTop: "4px" }}>
              Resubmitting may change the rest of this conversation branch.
            </div>
          </div>
        ) : (
          <div
            className="nx-glass-card"
            style={{
              padding: "12px 15px",
              borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: isUser ? "var(--nx-accent-soft)" : "var(--nx-glass)",
              fontSize: "14.5px", lineHeight: 1.6, whiteSpace: "pre-wrap"
            }}
          >
            {content}
          </div>
        )}

        {!editing && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {!isUser && (
              <>
                <IconBtn label="Copy" onClick={handleCopy}><Copy size={14} /></IconBtn>
                {speaking ? (
                  <IconBtn label="Stop reading" onClick={onStopReading}><Square size={14} /></IconBtn>
                ) : (
                  <IconBtn label="Read aloud" onClick={onReadAloud}><Volume2 size={14} /></IconBtn>
                )}
                <IconBtn label="Share" onClick={handleShare}><Share2 size={14} /></IconBtn>
                <IconBtn label="Screenshot" onClick={() => showToast("Screenshot saved")}><Camera size={14} /></IconBtn>
                <GlassMenu
                  trigger={<IconBtn label="More"><MoreVertical size={14} /></IconBtn>}
                  items={[
                    { label: "Copy", icon: <Copy size={14} />, onSelect: handleCopy },
                    { label: speaking ? "Stop reading" : "Read aloud", icon: speaking ? <Square size={14} /> : <Volume2 size={14} />, onSelect: speaking ? onStopReading : onReadAloud },
                    { label: "Share", icon: <Share2 size={14} />, onSelect: handleShare },
                    { label: "Regenerate", icon: <RefreshCw size={14} />, onSelect: onRegenerate, show: !!onRegenerate },
                    { divider: true },
                    { label: "Delete", icon: <Trash2 size={14} />, onSelect: onDelete, danger: true }
                  ]}
                />
              </>
            )}
            {isUser && (
              <GlassMenu
                trigger={<IconBtn label="More"><MoreVertical size={14} /></IconBtn>}
                items={[
                  { label: "Edit", icon: <Pencil size={14} />, onSelect: () => setEditing(true) },
                  { label: "Copy", icon: <Copy size={14} />, onSelect: handleCopy },
                  { divider: true },
                  { label: "Delete", icon: <Trash2 size={14} />, onSelect: onDelete, danger: true }
                ]}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="nx-focus-ring"
      style={{
        width: 28, height: 28, borderRadius: "999px", border: "none",
        background: "transparent", color: "var(--nx-ink-faint)",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--nx-glass-strong)"; e.currentTarget.style.color = "var(--nx-ink)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--nx-ink-faint)"; }}
    >
      {children}
    </button>
  );
}

const ghostBtn = {
  fontSize: "12.5px", padding: "7px 13px", borderRadius: "999px",
  border: "1px solid var(--nx-border-strong)", background: "transparent",
  color: "var(--nx-ink)", cursor: "pointer", fontFamily: "inherit"
};
