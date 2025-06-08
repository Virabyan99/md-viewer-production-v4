// lib/lexicalTheme.ts
export const lexicalTheme: Record<string, string | Record<string, string>> = {
  paragraph: "mb-[var(--baseline)] text-surface-900 dark:text-surface-50",
  text: {
    bold: "font-semibold text-brand dark:text-brand/80",
    italic: "italic text-brand-800 dark:text-brand-200",
    underline: "underline decoration-brand-500/60 underline-offset-2",
    strikethrough: "line-through opacity-70",
    code: "font-mono text-[0.95em] rounded px-1 py-0.5 bg-surface-50 text-surface-800 dark:bg-surface-900/50 dark:text-surface-50",
  },
  heading: {
    h1: "text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-50",
    h2: "text-xl font-semibold tracking-tight text-surface-900 dark:text-surface-50",
    h3: "text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-50",
    h4: "text-base font-semibold text-surface-900 dark:text-surface-50",
    h5: "text-sm font-semibold text-surface-900 dark:text-surface-50",
    h6: "text-xs font-semibold uppercase text-surface-900 dark:text-surface-50",
  },
  list: {
    nested: {
      listitem: "my-0",
    },
    ol: "list-decimal pl-6 marker:text-brand-600 dark:marker:text-brand-300",
    ul: "list-disc pl-6 marker:text-brand-600 dark:marker:text-brand-300",
    listitem: "my-1",
  },
  quote: "border-l-4 pl-4 bg-surface-50 text-surface-700 dark:bg-surface-900/40 dark:text-surface-200",
  code: "rounded bg-surface-900 text-surface-50 p-4 overflow-x-auto font-mono text-sm my-4",
  link: "text-brand underline hover:text-brand/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
  hr: "my-[calc(var(--baseline)*1.5)] border-t border-surface-200 dark:border-surface-700",
};