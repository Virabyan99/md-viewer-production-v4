import smartypants from "smartypants";
import { LexicalEditor } from "lexical";

export type TypographyRule = (text: string) => string;

/**
 * Default rule: smartypants for quotes, dashes, ellipses, etc.
 */
export const DEFAULT_RULES: TypographyRule[] = [smartypants];

/**
 * Enhance the plain text content of a Lexical editor with typography rules.
 */
export function enhanceTypography(
  editor: LexicalEditor,
  rules: TypographyRule[] = DEFAULT_RULES,
) {
  editor.update(() => {
    const root = editor.getRootElement();
    if (!root) return;
    root.querySelectorAll("p, li, blockquote").forEach((node) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const original = child.textContent ?? "";
          const transformed = rules.reduce((txt, fn) => fn(txt), original);
          if (original !== transformed) child.textContent = transformed;
        }
      });
    });
  });
}