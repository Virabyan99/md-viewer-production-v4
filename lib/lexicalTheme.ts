/**
 * Tailwind-augmented theme mapping for Lexical nodes.
 * Extend or override this object per design system or brand theme.
 */
export const lexicalTheme: Record<string, string | Record<string, string>> = {
  paragraph: "mb-[var(--baseline)]",
  text: {
    bold: "font-semibold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[0.9em]",
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
    ol: "list-decimal pl-6",
    ul: "list-disc pl-6",
    listitem: "my-1",
  },
  quote: "border-l-4 pl-4 italic text-muted-foreground my-[var(--baseline)]",
  code: "rounded bg-muted px-4 py-2 font-mono text-sm",
  link: "text-blue-500 underline",
  hr: "my-[calc(var(--baseline)*1.5)] border-t border-muted-foreground/40",
};

/**
 * Example of extending the theme for custom nodes:
 * import { lexicalTheme } from "./lexicalTheme";
 * export const extendedTheme = {
 *   ...lexicalTheme,
 *   callout: "border-l-2 pl-3 bg-yellow-50 dark:bg-yellow-900/20",
 * };
 */