import type { LexicalEditor } from "lexical";

export interface ViewerPlugin {
  /**
   * Called once after the editor mounts.
   * Returns a cleanup function if needed.
   */
  init(editor: LexicalEditor): void | (() => void);
}