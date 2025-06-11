import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { $generateNodesFromDOM } from "@lexical/html";
import { CodeNode } from "@lexical/code";
import { ensureFontFor } from "@/lib/fontLoader";
import { parseCodeFences } from "@/lib/parseCodeFences";
import { parseMarkdownTablesToHtml } from "@/lib/markdown";
import { TRANSFORMERS } from "@/lib/transformers";
import { $createPrismCodeHighlightNode } from "./PrismCodeHighlightNode";

interface MarkdownLoaderProps {
  markdown: string | null;
  setErrors: (errors: string[]) => void; // Add setErrors prop
}

export function MarkdownLoader({ markdown, setErrors }: MarkdownLoaderProps) {
  const [editor] = useLexicalComposerContext();

 useEffect(() => {
  if (markdown) {
    ensureFontFor(markdown);
    editor.update(() => {
      const root = $getRoot();
      root.clear();

      const hasTable = /^\|(.+)\|\n\|([: ]*[-]+[: ]*\|)+/m.test(markdown);

      if (hasTable) {
        const htmlContent = parseMarkdownTablesToHtml(markdown);
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlContent, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        root.append(...nodes);
      } else {
        $convertFromMarkdownString(markdown, TRANSFORMERS);
      }

      // Replace code nodes with PrismCodeHighlightNode for both branches
      const { codeBlocks, errors } = parseCodeFences(markdown);
      setErrors(errors);

      root.getChildren().forEach((node) => {
        if (node.getType() === "code") {
          const codeNode = node as CodeNode;
          const language = codeNode.getLanguage() || "text";
          const code = codeNode.getTextContent();
          const block = codeBlocks.find((b) => b.code === code);
          const broken = block ? block.broken : false;
          const prismNode = $createPrismCodeHighlightNode(code, language, broken);
          node.replace(prismNode);
        }
      });
    });
  } else {
    setErrors([]);
    editor.update(() => {
      $getRoot().clear();
    });
  }
}, [editor, markdown, setErrors]);

  return null;
}