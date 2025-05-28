import { LexicalEditor } from "lexical";
import { enhanceTypography, DEFAULT_RULES } from "@/lib/typographyEnhancer";

export const TypographyPlugin = {
  init: (editor: LexicalEditor) => {
    const listener = () => enhanceTypography(editor, DEFAULT_RULES);
    return editor.registerUpdateListener(listener);
  },
};