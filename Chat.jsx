import { useState, useRef, useEffect } from "react";
import { Menu, Send, Square } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ChatMessage from "../components/ChatMessage";
import { GlassDrawer } from "../components/glass/GlassOverlays";
import { useReadAloud } from "../hooks/useReadAloud";

// Placeholder history — wire this up to
// users/{uid}/conversations/{id}/messages once the backend
// (Cloud Function → Gemini) is connected (spec sections 9 & 31).
const SEED_MESSAGES = [
  { id: "m1", role: "assistant", content: "Welcome to Nirbhay Explorer AI. Ask me anything to get started." }
];

export default function Chat() {
  const { isAdmin } = useAuth();
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const listRef = useRef(null);
  const { supported: ttsSupported, speakingId, speak, stop } = useReadAloud();

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function handleNewChat() {
    setMessages(SEED_MESSAGES);
  }

  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    const userMsg = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);

    // TODO: replace with a call to the secure backend, e.g.
    //   const reply = await callGeminiChat({ conversationId, message: text });
    // The Gemini API key never touches the browser (spec section 9/31).
    await new Promise((r) => setTimeout(r, 500));
    setMessages((m) => [
      ...m,
      { id: crypto.randomUUID(), role: "assistant", content: "This is a placeholder reply. Connect the secure Cloud Function backend to get real Gemini responses here." }
    ]);
    setSending(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={{ display: "flex", height: "100%", gap: "14px", padding: "14px" }}>
      <Sidebar conversations={[]} isAdmin={isAdmin} onNewChat={handleNewChat} className="nx-sidebar-desktop" />

      <GlassDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Sidebar conversations={[]} isAdmin={isAdmin} onNewChat={() => { handleNewChat(); setDrawerOpen(false); }} />
      </GlassDrawer>

      <div className="nx-glass-card" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, borderRadius: "var(--nx-radius-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 18px", borderBottom: "1px solid var(--nx-border)" }}>
          <button
            className="nx-sidebar-toggle nx-focus-ring"
            onClick={() => setDrawerOpen(true)}
            style={{ background: "var(--nx-glass-strong)", border: "1px solid var(--nx-border)", borderRadius: "999px", width: 34, height: 34, display: "none", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            aria-label="Open menu"
          >
            <Menu size={16} />
          </button>
          <div style={{ fontSize: "14px", fontWeight: 600 }}>New conversation</div>
        </div>

        <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "20px 18px" }}>
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              role={m.role}
              content={m.content}
              speaking={ttsSupported && speakingId === m.id}
              onReadAloud={() => speak(m.id, m.content)}
              onStopReading={stop}
              onDelete={() => setMessages((cur) => cur.filter((x) => x.id !== m.id))}
              onEdit={(newText) => setMessages((cur) => cur.map((x) => (x.id === m.id ? { ...x, content: newText } : x)))}
            />
          ))}
          {sending && (
            <div style={{ maxWidth: "760px", margin: "0 auto", fontSize: "13px", color: "var(--nx-ink-faint)", display: "flex", gap: "6px", alignItems: "center" }}>
              <TypingDots /> Nirbhay is thinking
            </div>
          )}
        </div>

        <form onSubmit={handleSend} style={{ padding: "14px 18px", paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))", borderTop: "1px solid var(--nx-border)" }}>
          <div className="nx-glass-surface" style={{ borderRadius: "var(--nx-radius-md)", display: "flex", alignItems: "flex-end", gap: "10px", padding: "10px 10px 10px 16px" }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Nirbhay Explorer AI"
              rows={1}
              disabled={sending}
              style={{
                flex: 1, resize: "none", background: "transparent", border: "none", outline: "none",
                color: "var(--nx-ink)", fontSize: "14.5px", fontFamily: "inherit", lineHeight: 1.5,
                maxHeight: "160px", padding: "6px 0"
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              aria-label={sending ? "Sending" : "Send"}
              className="nx-focus-ring"
              style={{
                width: 34, height: 34, borderRadius: "999px", flex: "none",
                border: "none", cursor: input.trim() && !sending ? "pointer" : "not-allowed",
                background: input.trim() && !sending ? "var(--nx-accent)" : "var(--nx-glass-strong)",
                color: input.trim() && !sending ? "#fff" : "var(--nx-ink-faint)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              {sending ? <Square size={14} /> : <Send size={15} />}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 860px){
          .nx-sidebar-desktop{ display:none; }
          .nx-sidebar-toggle{ display:flex !important; }
        }
      `}</style>
    </div>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: "3px" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 4, height: 4, borderRadius: "50%", background: "var(--nx-ink-faint)",
            animation: `nx-bounce 1s ${i * 0.15}s infinite ease-in-out`
          }}
        />
      ))}
      <style>{`@keyframes nx-bounce{0%,80%,100%{opacity:0.25}40%{opacity:1}}`}</style>
    </span>
  );
}
