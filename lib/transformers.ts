import { TRANSFORMERS as DEFAULT_TRANSFORMERS, $convertFromMarkdownString } from "@lexical/markdown";
import { ListNode, ListItemNode, $createListNode, $createListItemNode } from "@lexical/list";
import { TableNode, TableRowNode, TableCellNode, $createTableNode, $createTableRowNode, $createTableCellNode } from "@lexical/table";
import { $createTextNode, TextNode, ParagraphNode, $createParagraphNode, $getRoot } from "lexical";

// Task List Transformer (unchanged)
const TASK_LIST_TRANSFORMER = {
  dependencies: [ListNode, ListItemNode],
  export: (node) => null, // Viewer-only, no export needed yet
  regExp: /^[-*+] \[( |x)\] (.*)$/,
  replace: (textNode, match) => {
    const [, checked, content] = match;
    const list = $createListNode("bullet");
    const item = $createListItemNode();
    item.setChecked(checked === "x");
    item.append($createTextNode(content));
    list.append(item);
    textNode.replace(list);
  },
  type: "text-match",
};



export const TRANSFORMERS = [
  ...DEFAULT_TRANSFORMERS,
  TASK_LIST_TRANSFORMER,
  // TABLE_TRANSFORMER,
];







// Custom Table Transformer
// const TABLE_TRANSFORMER = {
//   type: "text-match",
//   dependencies: [TableNode, TableRowNode, TableCellNode, ParagraphNode],
//   regExp: /^\|(.+)\|\n\|([: ]*[-]+[: ]*\|)+\n((?:\|.*\|\n)*)/gm,
//   replace: (textNode: TextNode, match: RegExpMatchArray, { editor }) => {
//     const [fullMatch, headerRow, separatorRow, bodyRows] = match;

//     // Parse alignment from separator row
//     const alignments = separatorRow.split("|").map((sep) => {
//       const trimmed = sep.trim();
//       if (trimmed.startsWith(":") && trimmed.endsWith(":")) return "center";
//       if (trimmed.endsWith(":")) return "right";
//       return "left";
//     }).filter(Boolean);

//     // Create the table node
//     const tableNode = $createTableNode();

//     // Function to create a cell with parsed content and alignment
//     const createCell = (content: string, isHeader: boolean, alignment: string) => {
//       const cell = $createTableCellNode(isHeader ? 1 : 0); // 1 for header, 0 for normal
//       const paragraph = $createParagraphNode();
//       paragraph.setFormat(alignment); // Set alignment ("left", "center", "right")

//       // Parse Markdown content within the editor
//       editor.update(() => {
//         const root = $getRoot();
//         const tempParagraph = $createParagraphNode();
//         root.append(tempParagraph);
//         $convertFromMarkdownString(content, DEFAULT_TRANSFORMERS);
//         const children = tempParagraph.getChildren();
//         paragraph.append(...children);
//         tempParagraph.remove();
//       });

//       cell.append(paragraph);
//       return cell;
//     };

//     // Parse headers
//     const headers = headerRow.split("|").map((h) => h.trim()).filter(Boolean);
//     const headerRowNode = $createTableRowNode();
//     headers.forEach((header, index) => {
//       const alignment = alignments[index] || "left";
//       const cell = createCell(header, true, alignment);
//       headerRowNode.append(cell);
//     });
//     tableNode.append(headerRowNode);

//     // Parse body rows
//     if (bodyRows) {
//       const rows = bodyRows.trim().split("\n");
//       rows.forEach((row) => {
//         const rowNode = $createTableRowNode();
//         const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
//         cells.forEach((cellContent, index) => {
//           const alignment = alignments[index] || "left";
//           const cell = createCell(cellContent, false, alignment);
//           rowNode.append(cell);
//         });
//         tableNode.append(rowNode);
//       });
//     }

//     // Replace the original text node with the table node
//     textNode.replace(tableNode);
//   },
// };