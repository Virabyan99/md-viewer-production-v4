import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CodeNode } from "@lexical/code";
import { $getRoot } from "lexical";
import { $createPrismCodeHighlightNode } from "./PrismCodeHighlightNode";

export function PrismHighlightPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const highlightCodeBlocks = () => {
      editor.update(() => {
        const root = $getRoot();
        root.getChildren().forEach((node) => {
          if (node.getType() === "code") {
            const codeNode = node as CodeNode;
            const text = codeNode.getTextContent();
            const lang = codeNode.getLanguage() ?? "text";
            const prismNode = $createPrismCodeHighlightNode(text, lang);
            node.replace(prismNode);
          }
        });
      });
    };

    const unregister = editor.registerUpdateListener(highlightCodeBlocks);
    highlightCodeBlocks();
    return () => unregister();
  }, [editor]);

  return null;
}