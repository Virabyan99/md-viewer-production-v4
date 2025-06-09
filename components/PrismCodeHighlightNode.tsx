// components/PrismCodeHighlightNode.tsx
import { DecoratorNode, NodeKey, SerializedLexicalNode } from 'lexical';
import Prism from 'prismjs';

export class PrismCodeHighlightNode extends DecoratorNode<JSX.Element | null> {
  __html: string;

  static getType() {
    return 'prism-code-highlight';
  }

  static clone(node: PrismCodeHighlightNode) {
    return new PrismCodeHighlightNode(node.__html, node.__key);
  }

  static importJSON(json: SerializedLexicalNode & { html: string }) {
    return new PrismCodeHighlightNode(json.html);
  }

  constructor(html: string, key?: NodeKey) {
    super(key);
    this.__html = html;
  }

  createDOM() {
    const pre = document.createElement('pre');
    pre.className = 'prose-pre'; // Add class for Tailwind styling
    pre.innerHTML = this.__html;
    return pre;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return null; // No React component needed
  }

  exportJSON(): SerializedLexicalNode & { html: string } {
    return {
      type: 'prism-code-highlight',
      version: 1,
      html: this.__html,
    };
  }
}

export function $createPrismCodeHighlightNode(code: string, language: string): PrismCodeHighlightNode {
  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.text,
    language
  );
  const html = `<code class="language-${language}">${highlightedCode}</code>`;
  return new PrismCodeHighlightNode(html);
}