"use client";

import { FC } from "react";
import Link from "next/link";
import { IconMarkdown } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ExportMenu } from "./ExportMenu";
import { FilePicker } from "./FilePicker";

export const Header: FC = () => (
  <header
    role="banner"
    aria-label="Global header"
    className="sticky top-0 z-30 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50"
  >
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <Link
        href="/"
        aria-label="Home - Markdown Viewer"
        className="flex items-center gap-2 font-semibold"
      >
        <IconMarkdown className="size-5" aria-hidden />
        <span className="sr-only">Home</span>
      </Link>
      <nav role="navigation" aria-label="Primary navigation" className="flex gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/viewer">Viewer</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link
            href="https://github.com/Virabyan99/md-viewer-production-v4"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
        </Button>
        <ThemeToggle />
        <ExportMenu />
        <FilePicker />
      </nav>
    </div>
  </header>
);