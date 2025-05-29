"use client";

import { FC } from "react";
import Link from "next/link";
import { IconBrandGithub, IconMarkdown } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ExportMenu } from "./ExportMenu";
import dynamic from "next/dynamic";

// Dynamically import FilePicker with SSR disabled, accessing the named export
const FilePicker = dynamic(() => import("@/components/FilePicker").then(mod => mod.FilePicker), {
  ssr: false,
});

export const Header: FC = () => (
  <header
    role="banner"
    aria-label="Global header"
    className="sticky top-0 z-30 w-full  bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50"
  >
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1">
      <Link
        href="/"
        aria-label="Home - Markdown Viewer"
        className="flex items-center  font-semibold"
      >
        <IconMarkdown className="size-8" aria-hidden />
        <span className="sr-only">Home</span>
      </Link>
      <nav role="navigation" aria-label="Primary navigation" className="flex gap-2">
       
       
        <ThemeToggle />
        <ExportMenu />
        <FilePicker />
      </nav>
    </div>
  </header>
);