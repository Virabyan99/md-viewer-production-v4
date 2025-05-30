/**
 * Tailwind-augmented theme mapping for Lexical nodes.
 * Extend or override this object per design system or brand theme.
 */
export const lexicalTheme: Record<string, string | Record<string, string>> = {
  paragraph: "mb-[var(--baseline)]",
  text: {
    bold: "font-semibold text-brand-900 dark:text-brand-100",
    italic: "italic text-brand-800 dark:text-brand-200",
    underline: "underline decoration-brand-500/60 underline-offset-2",
    strikethrough: "line-through opacity-70",
    code: "font-mono text-[0.95em] rounded px-1 py-0.5 bg-surface-50 dark:bg-surface-900/40",
  },
  heading: {
    h1: "text-2xl font-bold tracking-tight",
    h2: "text-xl font-semibold tracking-tight",
    h3: "text-lg font-semibold tracking-tight",
    h4: "text-base font-semibold",
    h5: "text-sm font-semibold",
    h6: "text-xs font-semibold uppercase",
  },
  list: {
    nested: {
      listitem: "my-0",
    },
    ol: "list-decimal pl-6 marker:text-brand-600 dark:marker:text-brand-400",
    ul: "list-disc pl-6 marker:text-brand-600 dark:marker:text-brand-400",
    listitem: "my-1",
  },
  quote: "border-l-4 pl-4 bg-surface-50 dark:bg-surface-900/30 italic text-muted-foreground",
  code: "rounded bg-muted px-4 py-2 font-mono text-sm",
  link: "text-brand underline hover:text-brand/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
  hr: "my-[calc(var(--baseline)*1.5)] border-t border-surface-50 dark:border-surface-900/40",
};