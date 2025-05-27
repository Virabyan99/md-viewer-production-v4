"use client";

import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { PluginProvider } from "./PluginContext";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { MarkdownParser } from "@/lib/markdownParser";

interface LexicalViewerProps {
  markdown: string | null;
}

export function LexicalViewer({ markdown }: LexicalViewerProps) {
  const composerConfig = {
    namespace: "markdown-viewer",
    editable: false,
    theme: {
      heading: {
        h1: "text-4xl font-bold",
        h2: "text-3xl font-bold",
      },
      list: {
        ul: "list-disc pl-6",
        ol: "list-decimal pl-6",
      },
      quote: "border-l-4 pl-4 italic",
      code: "bg-muted p-1 rounded",
      link: "text-blue-500 underline",
    },
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
    ],
  };

  return (
    <LexicalComposer initialConfig={composerConfig}>
      <MarkdownLoader markdown={markdown} />
      <PluginProvider plugins={[]}>
        {markdown ? (
          <ContentEditable className="prose dark:prose-invert max-w-none" />
        ) : (
          <div className="grid min-h-[40vh] place-content-center text-center text-muted-foreground">
            <p>No document loaded.<br />Drag a <code>.md</code> file to begin.</p>
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
      const parser = new MarkdownParser(editor);
      parser.import(markdown);
    }
  }, [editor, markdown]);

  return null;
}