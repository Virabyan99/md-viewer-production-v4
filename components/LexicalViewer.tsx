"use client";
import { useState } from "react";
import Prism from "@/prism/prismConfig"; // Ensure Prism is loaded
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
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
import { MarkdownLoader } from "./MarkdownLoader";
import { PrismCodeHighlightNode } from "./PrismCodeHighlightNode"; // Assuming this is your custom node

interface LexicalViewerProps {
  markdown: string | null;
}

export function LexicalViewer({ markdown }: LexicalViewerProps) {
  const t = useTranslations("viewer.placeholder");
  const [errors, setErrors] = useState<string[]>([]);

  const composerConfig = {
    namespace: "markdown-viewer",
    editable: false,
    theme: lexicalTheme,
    onError(error: Error) {
      throw error;
    },
    nodes: [
      HeadingNode,        // For Markdown headings (#, ##, etc.)
      QuoteNode,          // For blockquotes (>)
      ListNode,           // For ordered/unordered lists
      ListItemNode,       // Required for list items
      LinkNode,           // For hyperlinks
      CodeNode,           // For code blocks (```)
      HorizontalRuleNode, // For horizontal rules (---)
      LexicalTableNode,   // For tables
      TableRowNode,       // Required for table rows
      TableCellNode,      // Required for table cells
      PrismCodeHighlightNode, // Your custom node for code highlighting
    ],
  };

  return (
    <LexicalComposer initialConfig={composerConfig}>
      <MarkdownLoader markdown={markdown} setErrors={setErrors} />
      <PluginProvider plugins={[TypographyPlugin]}>
        {errors.length > 0 && (
          <div className="mb-4 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded text-yellow-900">
            <ul>
              {errors.map((err, i) => (
                <li key={i}>⚠️ {err}</li>
              ))}
            </ul>
          </div>
        )}
        {markdown ? (
          <div>
            <ContentEditable className="prose dark:prose-invert max-w-5xl" />
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