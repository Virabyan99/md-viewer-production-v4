// lib/markdown.ts
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

export function parseMarkdownToHtml(markdown: string): string {
  const result = remark()
    .use(remarkGfm) // Support for tables and other GFM features
    .use(remarkRehype) // Convert Markdown AST to HTML AST
    .use(rehypeSanitize) // Sanitize HTML for security
    .use(rehypeStringify) // Convert to HTML string
    .use(rehypeHighlight) // Syntax highlighting for code blocks
    .processSync(markdown);
  return result.toString();
}