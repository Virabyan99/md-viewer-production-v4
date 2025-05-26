"use client";

import { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { PluginProvider } from "./PluginContext";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

interface LexicalViewerProps {
  /**
   * When null, a placeholder UI is shown. Otherwise, the Markdown content to render.
   */
  markdown: string | null;
}

/**
 * Production-ready, read-only Markdown viewer.
 */
export function LexicalViewer({ markdown }: LexicalViewerProps) {
  const composerConfig = {
    namespace: "markdown-viewer",
    editable: false,
    theme: {}, // We’ll use Tailwind for styling
    onError(error: Error) {
      throw error; // Caught by error boundary in components/error.tsx
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
      <PluginProvider plugins={[] /* Add plugins in future lessons */}>
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

/**
 * Loads Markdown content into the Lexical editor.
 */
function MarkdownLoader({ markdown }: { markdown: string | null }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (markdown) {
      editor.update(() => {
        $convertFromMarkdownString(markdown, TRANSFORMERS);
      });
    }
  }, [editor, markdown]);

  return null;
}