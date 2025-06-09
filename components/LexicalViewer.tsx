"use client";
import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TableNode as LexicalTableNode, TableRowNode, TableCellNode } from "@lexical/table";
import { PluginProvider } from "./PluginContext";
import { TypographyPlugin } from "./TypographyPlugin";
import { lexicalTheme } from "@/lib/lexicalTheme";
import { useTranslations } from "next-intl";
import { ensureFontFor } from "@/lib/fontLoader";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { $getRoot } from "lexical";
import { TRANSFORMERS } from "@/lib/transformers";
import { PrismCodeHighlightNode, $createPrismCodeHighlightNode } from "./PrismCodeHighlightNode";
import { TableNode } from "./TableNode"; // Import custom TableNode

interface LexicalViewerProps {
  markdown: string | null;
}

export function LexicalViewer({ markdown }: LexicalViewerProps) {
  const t = useTranslations("viewer.placeholder");

  const composerConfig = {
    namespace: "markdown-viewer",
    editable: false,
    theme: lexicalTheme,
    onError(error: Error) {
      throw error;
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      CodeNode,
      HorizontalRuleNode,
      LexicalTableNode,
      TableRowNode,
      TableCellNode,
      PrismCodeHighlightNode,
      TableNode, // Register custom TableNode
    ],
  };

  return (
    <LexicalComposer initialConfig={composerConfig}>
      <MarkdownLoader markdown={markdown} />
      <PluginProvider plugins={[TypographyPlugin]}>
        {markdown ? (
          <div>
            <ContentEditable className="prose dark:prose-invert max-w-none" />
          </div>
        ) : (
          <div className="grid min-h-[40vh] place-content-center text-center text-muted-foreground">
            <p>
              {t("part1")}
              <br />
              {t("part2")} <code>.md</code> {t("part3")}
            </p>
          </div>
        )}
      </PluginProvider>
    </LexicalComposer>
  );
}

function MarkdownLoader({ markdown }: { markdown: string | null }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (markdown) {
      ensureFontFor(markdown);
      editor.update(() => {
        $convertFromMarkdownString(markdown, TRANSFORMERS);
        const root = $getRoot();
        root.getChildren().forEach((node) => {
          if (node.getType() === 'code') {
            const codeNode = node as CodeNode;
            const language = codeNode.getLanguage() || 'text';
            const code = codeNode.getTextContent();
            const prismNode = $createPrismCodeHighlightNode(code, language);
            node.replace(prismNode);
          }
        });
      });
    } else {
      editor.update(() => {
        $getRoot().clear();
      });
    }
  }, [editor, markdown]);

  return null;
}