import { TRANSFORMERS as DEFAULT_TRANSFORMERS } from "@lexical/markdown";
import { ListNode, ListItemNode, $createListNode, $createListItemNode } from "@lexical/list";
import { $createTextNode } from "lexical";

const TASK_LIST_TRANSFORMER = {
  dependencies: [ListNode, ListItemNode],
  export: (node) => null, // Viewer-only, no export needed yet
  regExp: /^[-*+] \[( |x)\] (.*)$/,
  replace: (textNode, match) => {
    const [, checked, content] = match;
    const list = $createListNode("bullet");
    const item = $createListItemNode();
    item.setChecked(checked === "x"); // Sets the checked state
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

console.log("Transformers:", TRANSFORMERS);