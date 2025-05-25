"use client";

import { createContext, useContext, useEffect, useState, useTransition } from "react";
import { loadTheme, saveTheme } from "@/lib/theme";

type Theme = "light" | "dark";
interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}
const Ctx = createContext<ThemeCtx | null>(null);

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ThemeProvider missing");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [, startTransition] = useTransition();

  // Load theme from IndexedDB or system preference on mount
  useEffect(() => {
    (async () => {
      const persisted = await loadTheme();
      const initial: Theme =
        persisted ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      startTransition(() => setThemeState(initial));
      document.documentElement.classList.toggle("dark", initial === "dark");
    })();
  }, []);

  // Update theme, persist it, and toggle the class
  const setTheme = (next: Theme) => {
    saveTheme(next);
    setThemeState(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}