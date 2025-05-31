// components/Header.tsx
"use client";

import { FC } from "react";
import { IconBrandGithub, IconMarkdown } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ExportMenu } from "./ExportMenu";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher"; // Add this import

const FilePicker = dynamic(
  () => import("@/components/FilePicker").then((mod) => mod.FilePicker),
  { ssr: false }
);

export const Header: FC = () => {
  const t = useTranslations("header");
  return (
    <header
      role="banner"
      aria-label="Global header"
      className="sticky top-0 z-30 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1">
        <Link href="/" aria-label={t("home")} className="flex items-center font-semibold">
          <IconMarkdown className="size-8" aria-hidden />
          <span className="sr-only">{t("home")}</span>
        </Link>
        <nav role="navigation" aria-label="Primary navigation" className="flex gap-2">
          <ThemeToggle />
          <ExportMenu />
          <FilePicker />
          <LanguageSwitcher /> {/* Add this line */}
        </nav>
      </div>
    </header>
  );
};