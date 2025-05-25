import { FC } from "react";

export const Footer: FC = () => (
  <footer
    role="contentinfo"
    aria-label="Global footer"
    className="mt-auto w-full border-t bg-muted/50"
  >
    <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground">
      © {new Date().getFullYear()} Markdown Viewer · MIT License
    </div>
  </footer>
);