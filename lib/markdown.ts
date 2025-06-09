import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { wrapTables } from "./wrapTables";

export function parseMarkdownTablesToHtml(markdown: string): string {
  const result = remark()
    .use(remarkGfm) // Support GFM tables
    .use(remarkRehype)
    .use(wrapTables) // Wrap tables for styling
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .processSync(markdown);
  return result.toString();
}