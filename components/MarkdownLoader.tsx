import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { createLexicalNodesFromAST } from "@/lib/astToLexical";
import { ensureFontFor } from "@/lib/fontLoader";

interface MarkdownLoaderProps {
  markdown: string | null;
  setErrors: (errors: string[]) => void;
}

export function MarkdownLoader({ markdown, setErrors }: MarkdownLoaderProps) {
  const [editor] = useLexicalComposerContext();

useEffect(() => {
  if (markdown) {
    ensureFontFor(markdown);
    const processor = remark().use(remarkGfm);
    const ast = processor.parse(markdown);
    console.log('Parsed AST:', JSON.stringify(ast, null, 2));
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      ast.children.forEach((astNode: any) => {
        const lexicalNode = createLexicalNodesFromAST(astNode);
        if (lexicalNode) {
          console.log("Appending node of type:", lexicalNode.getType());
          root.append(lexicalNode);
        }
      });
    });
    // Log state after update
    setTimeout(() => {
      console.log("Editor state after update:", JSON.stringify(editor.getEditorState().toJSON(), null, 2));
    }, 0);
  } else {
    setErrors([]);
    editor.update(() => {
      $getRoot().clear();
    });
  }
}, [editor, markdown, setErrors]);

  return null;
}