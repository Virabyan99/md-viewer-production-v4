"use client";

import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <IconSun className="size-5" aria-hidden /> : <IconMoon className="size-5" aria-hidden />}
      <span className="sr-only">Switch to {isDark ? "light" : "dark"} mode</span>
    </Button>
  );
}