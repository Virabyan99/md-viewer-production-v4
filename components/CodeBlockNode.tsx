// components/CodeBlockNode.tsx
import { $applyNodeReplacement, DecoratorNode, NodeKey, SerializedLexicalNode } from 'lexical';
import { FC } from 'react';
import DOMPurify from 'dompurify';
import { highlightCode } from '@/prism/prismConfig';

// Define the data structure for the CodeBlockNode
interface CodeBlockNodeData {
  code: string;
  language: string;
}

// Define the serialized node structure
interface SerializedCodeBlockNode extends SerializedLexicalNode {
  code: string;
  language: string;
}

export class CodeBlockNode extends DecoratorNode<JSX.Element> {
  __data: CodeBlockNodeData;

  constructor(data: CodeBlockNodeData, key?: NodeKey) {
    super(key);
    this.__data = data;
    console.log('CodeBlockNode: Constructor called with data:', data);
  }

  static getType(): string {
    console.log('CodeBlockNode: getType called');
    return 'codeblock';
  }

  static clone(node: CodeBlockNode): CodeBlockNode {
    console.log('CodeBlockNode: clone called with node:', node.__data);
    return new CodeBlockNode(node.__data, node.__key);
  }

createDOM(): HTMLElement {
  console.log('CodeBlockNode: createDOM called with data:', this.__data);
  const pre = document.createElement('pre');
  pre.className = `code-block language-${this.__data.language}`;
  pre.setAttribute('data-lexical-decorator', 'true');
  console.log('CodeBlockNode: Created <pre> DOM element:', pre.outerHTML);
  return pre;
}

  updateDOM(): boolean {
    console.log('CodeBlockNode: updateDOM called');
    return false;
  }

  decorate(): JSX.Element {
    console.log('CodeBlockNode: decorate called with data:', this.__data);
    const element = <CodeBlockDecorator code={this.__data.code} language={this.__data.language} />;
    console.log('CodeBlockNode: Decorator JSX returned');
    return element;
  }

  exportJSON(): SerializedCodeBlockNode {
    console.log('CodeBlockNode: exportJSON called with data:', this.__data);
    return {
      type: 'codeblock',
      version: 1,
      code: this.__data.code,
      language: this.__data.language,
    };
  }

  static importJSON(serialized: SerializedCodeBlockNode): CodeBlockNode {
    console.log('CodeBlockNode: importJSON called with serialized:', serialized);
    const { code, language } = serialized;
    return $createCodeBlockNode({ code, language });
  }
}

export function $createCodeBlockNode(data: CodeBlockNodeData): CodeBlockNode {
  console.log('CodeBlockNode: $createCodeBlockNode called with data:', data);
  return $applyNodeReplacement(new CodeBlockNode(data));
}

const CodeBlockDecorator: FC<{ code: string; language: string }> = ({ code, language }) => {
  console.log('CodeBlockDecorator: Rendering with:', { code, language });
  const highlightedCode = highlightCode(code, language);
  console.log('CodeBlockDecorator: Highlighted code:', highlightedCode);
  const safeCode = DOMPurify.sanitize(highlightedCode, { USE_PROFILES: { html: true } });
  console.log('CodeBlockDecorator: Sanitized code:', safeCode);
  return <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: safeCode }} />;
};