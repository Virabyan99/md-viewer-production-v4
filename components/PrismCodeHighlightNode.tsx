// components/PrismCodeHighlightNode.tsx
import { DecoratorNode, NodeKey, SerializedLexicalNode } from 'lexical';
import Prism from 'prismjs';

export class PrismCodeHighlightNode extends DecoratorNode<JSX.Element | null> {
  __html: string;
  __code: string; // Store raw code for copying

  static getType() {
    return 'prism-code-highlight';
  }

  static clone(node: PrismCodeHighlightNode) {
    return new PrismCodeHighlightNode(node.__html, node.__code, node.__key);
  }

  static importJSON(json: SerializedLexicalNode & { html: string; code: string }) {
    return new PrismCodeHighlightNode(json.html, json.code);
  }

  constructor(html: string, code: string, key?: NodeKey) {
    super(key);
    this.__html = html;
    this.__code = code;
  }

  createDOM() {
    const container = document.createElement('div');
    container.className = 'relative group'; // For positioning and hover effects

    const pre = document.createElement('pre');
    pre.className = 'prose-pre';
    pre.innerHTML = this.__html;
    container.appendChild(pre);

    const button = document.createElement('button');
    button.className = 'absolute -top-5 right-2 opacity-70 group-hover:opacity-100 focus:opacity-100 transition-opacity z-10';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

    const feedback = document.createElement('span');
    feedback.className = 'absolute -top-5 right-12 bg-green-600 text-white text-xs px-2 py-1 rounded shadow hidden';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.textContent = 'Copied!';

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.__code);
        feedback.classList.remove('hidden');
        setTimeout(() => feedback.classList.add('hidden'), 2000);
      } catch (e) {
        console.error('Failed to copy code:', e);
      }
    });

    container.appendChild(button);
    container.appendChild(feedback);

    return container;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return null;
  }

  exportJSON(): SerializedLexicalNode & { html: string; code: string } {
    return {
      type: 'prism-code-highlight',
      version: 1,
      html: this.__html,
      code: this.__code,
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
  return new PrismCodeHighlightNode(html, code);
}