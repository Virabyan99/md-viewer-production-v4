import { FC } from "react";
import Link from "next/link";
import { IconMarkdown } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export const Header: FC = () => (
  <header className="sticky top-0 z-30 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <IconMarkdown className="size-5" aria-hidden />
        <span className="sr-only">Home</span>
      </Link>
      <nav className="flex gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/viewer">Viewer</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="https://github.com/your-username/markdown-viewer" target="_blank" rel="noreferrer">
            GitHub
          </Link>
        </Button>
        <ThemeToggle />
      </nav>
    </div>
  </header>
);