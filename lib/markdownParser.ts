import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { LexicalEditor } from "lexical";

/**
 * Core parsing context shared by viewer & editor.
 */
export class MarkdownParser {
  constructor(private editor: LexicalEditor) {}

  /**
   * Replace current editor state with Markdown input.
   */
  import(markdown: string) {
    this.editor.update(() => {
      $convertFromMarkdownString(markdown, TRANSFORMERS);
    });
  }

  /**
   * Serialise current editor state to Markdown.
   */
  export(): string {
    let md = "";
    this.editor.getEditorState().read(() => {
      md = $convertToMarkdownString(TRANSFORMERS);
    });
    return md;
  }

  /**
   * Round-trip helper for tests.
   */
  static roundTrip(markdown: string, editor: LexicalEditor): string {
    const parser = new MarkdownParser(editor);
    parser.import(markdown);
    return parser.export();
  }
}