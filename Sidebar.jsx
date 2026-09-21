import { NavLink } from "react-router-dom";
import { Plus, Search, Settings, FileText, Shield, Info, ScrollText, LockKeyhole } from "lucide-react";
import logo from "../assets/logo/nirbhay-logo.png";

const navItem = ({ isActive }) => ({
  display: "flex", alignItems: "center", gap: "10px",
  padding: "9px 12px", borderRadius: "var(--nx-radius-sm)",
  fontSize: "13.5px", textDecoration: "none",
  color: isActive ? "var(--nx-ink)" : "var(--nx-ink-dim)",
  background: isActive ? "var(--nx-glass-strong)" : "transparent"
});

export default function Sidebar({ conversations = [], isAdmin, onNewChat, className = "" }) {
  return (
    <aside
      className={`nx-glass-card ${className}`}
      style={{
        width: "260px", flex: "none", display: "flex", flexDirection: "column",
        padding: "16px", gap: "14px", borderRadius: "var(--nx-radius-lg)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "2px 4px" }}>
        <img src={logo} alt="Nirbhay Explorer AI" style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff" }} />
        <span style={{ fontSize: "13.5px", fontWeight: 650 }}>Nirbhay Explorer AI</span>
      </div>

      <button
        onClick={onNewChat}
        className="nx-focus-ring"
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "var(--nx-glass-strong)", border: "1px solid var(--nx-border-strong)",
          color: "var(--nx-ink)", borderRadius: "var(--nx-radius-sm)",
          padding: "10px 12px", fontSize: "13.5px", cursor: "pointer", fontFamily: "inherit"
        }}
      >
        <Plus size={15} /> New chat
      </button>

      <div style={{ position: "relative" }}>
        <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--nx-ink-faint)" }} />
        <input
          placeholder="Search conversations"
          style={{
            width: "100%", background: "rgba(0,0,0,0.14)", border: "1px solid var(--nx-border)",
            color: "var(--nx-ink)", borderRadius: "var(--nx-radius-sm)",
            padding: "9px 10px 9px 30px", fontSize: "12.5px", outline: "none", fontFamily: "inherit"
          }}
        />
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "3px" }}>
        {conversations.length === 0 && (
          <div style={{ fontSize: "12px", color: "var(--nx-ink-faint)", padding: "10px 6px" }}>
            No conversations yet. Start a new conversation.
          </div>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            style={{
              textAlign: "left", background: "transparent", border: "none", color: "var(--nx-ink-dim)",
              fontSize: "13px", padding: "8px 10px", borderRadius: "var(--nx-radius-sm)", cursor: "pointer",
              fontFamily: "inherit", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
            }}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px", borderTop: "1px solid var(--nx-border)", paddingTop: "10px" }}>
        <NavLink to="/settings" style={navItem}><Settings size={15} /> Settings</NavLink>
        <NavLink to="/documentation" style={navItem}><FileText size={15} /> Documentation</NavLink>
        <NavLink to="/terms" style={navItem}><ScrollText size={15} /> Terms</NavLink>
        <NavLink to="/privacy" style={navItem}><LockKeyhole size={15} /> Privacy</NavLink>
        <NavLink to="/about" style={navItem}><Info size={15} /> About</NavLink>
        {isAdmin && <NavLink to="/admin" style={navItem}><Shield size={15} /> Admin Panel</NavLink>}
      </div>
    </aside>
  );
}
