"use client";

import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const t = useTranslations("toggle"); // Fix: Use "toggle" namespace

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("theme")} // Fix: Use "theme" key
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <IconSun className="size-5" aria-hidden /> : <IconMoon className="size-5" aria-hidden />}
      <span className="sr-only">{t("theme")}</span>
    </Button>
  );
}