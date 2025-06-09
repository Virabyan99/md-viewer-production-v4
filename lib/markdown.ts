// // lib/markdown.ts
// import { remark } from "remark";
// import remarkGfm from "remark-gfm";
// import remarkRehype from "remark-rehype";
// import rehypeSanitize from "rehype-sanitize";
// import rehypeStringify from "rehype-stringify";
// import rehypeHighlight from "rehype-highlight";
// import { wrapTables } from "./wrapTables";

// export function parseMarkdownToHtml(markdown: string): string {
//   const result = remark()
//     .use(remarkGfm)
//     .use(remarkRehype)
//     .use(wrapTables)
//     .use(rehypeSanitize)
//     .use(rehypeHighlight)
//     .use(rehypeStringify)
//     .processSync(markdown);
//   return result.toString();
// }