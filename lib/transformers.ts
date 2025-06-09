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
  
];


