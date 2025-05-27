import { $convertFromMarkdownString, $convertToMarkdownString } from "@lexical/markdown";
import { LexicalEditor } from "lexical";
import { TRANSFORMERS } from "./transformers"; // Updated import

export class MarkdownParser {
  constructor(private editor: LexicalEditor) {}

  import(markdown: string) {
    this.editor.update(() => {
      $convertFromMarkdownString(markdown, TRANSFORMERS);
    });
  }

  export(): string {
    let md = "";
    this.editor.getEditorState().read(() => {
      md = $convertToMarkdownString(TRANSFORMERS);
    });
    return md;
  }

  static roundTrip(markdown: string, editor: LexicalEditor): string {
    const parser = new MarkdownParser(editor);
    parser.import(markdown);
    return parser.export();
  }
}