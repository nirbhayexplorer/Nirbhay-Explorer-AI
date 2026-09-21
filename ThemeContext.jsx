import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "nx_theme";       // "system" | "light" | "dark"
const ACCENT_KEY = "nx_accent";     // one of the accent tokens in theme.css
const DENSITY_KEY = "nx_density";   // "comfortable" | "compact"

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(THEME_KEY) || "system");
  const [accent, setAccentState] = useState(() => localStorage.getItem(ACCENT_KEY) || "blue");
  const [density, setDensityState] = useState(() => localStorage.getItem(DENSITY_KEY) || "comfortable");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  useEffect(() => {
    document.documentElement.setAttribute("data-density", density);
  }, [density]);

  // NOTE: once the user is authenticated, these setters should also
  // write to users/{uid}.settings in Firestore so preferences follow
  // the account. Fallback local persistence (below) covers signed-out
  // and offline states, per the product spec.
  const setTheme = useCallback((t) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  }, []);

  const setAccent = useCallback((a) => {
    setAccentState(a);
    localStorage.setItem(ACCENT_KEY, a);
  }, []);

  const setDensity = useCallback((d) => {
    setDensityState(d);
    localStorage.setItem(DENSITY_KEY, d);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent, density, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export const ACCENT_OPTIONS = [
  "blue", "indigo", "purple", "violet", "pink", "rose", "red", "orange",
  "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky",
  "slate", "graphite", "ocean", "aurora"
];
