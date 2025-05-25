"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { PluginProvider } from "./PluginContext";

interface LexicalViewerProps {
  /**
   * When null, a placeholder UI is shown.
   */
  initialMarkdown?: string | null;
}

/**
 * Production-ready, read-only Markdown viewer.
 */
export function LexicalViewer({ initialMarkdown = null }: LexicalViewerProps) {
  const composerConfig = {
    namespace: "markdown-viewer",
    editable: false,
    theme: {}, // We’ll use Tailwind for styling
    onError(error: Error) {
      throw error; // Caught by error boundary in components/error.tsx
    },
    nodes: [], // Plugins will add nodes later
  };

  return (
    <LexicalComposer initialConfig={composerConfig}>
      <PluginProvider plugins={[] /* Add plugins in future lessons */}>
        {initialMarkdown ? (
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