export function SkipToContent() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 rounded bg-primary px-4 py-2 text-primary-foreground"
    >
      Skip to main content
    </a>
  );
}