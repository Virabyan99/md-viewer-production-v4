"use client";
import { useSpring } from "@react-spring/web";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect } from "react";

export function useThemeTransition() {
  const { theme } = useTheme();
  const [styles, api] = useSpring(() => ({
    backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
    color: theme === "dark" ? "#e2e8f0" : "#0f172a",
    config: { mass: 1, tension: 210, friction: 26 },
  }));

  useEffect(() => {
    api.start({
      backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
      color: theme === "dark" ? "#e2e8f0" : "#0f172a",
    });
  }, [theme, api]);

  return styles;
}