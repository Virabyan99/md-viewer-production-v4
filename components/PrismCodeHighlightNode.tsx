import { DecoratorNode, NodeKey } from "lexical";
import Prism from "@/prism/prismConfig";
import { useCodeModal } from "./CodeModalContext";

export class PrismCodeHighlightNode extends DecoratorNode<JSX.Element | null> {
  __html: string;
  __code: string;
  __language: string;

  static getType() {
    return "prism-code-highlight";
  }

  static clone(node: PrismCodeHighlightNode) {
    return new PrismCodeHighlightNode(
      node.__html,
      node.__code,
      node.__language,
      node.__key
    );
  }

  static importJSON(json: any) {
    return new PrismCodeHighlightNode(json.html, json.code, json.language);
  }

  constructor(html: string, code: string, language: string, key?: NodeKey) {
    super(key);
    this.__html = html;
    this.__code = code;
    this.__language = language;
  }

  createDOM() {
    const container = document.createElement("div");
    container.className = "relative group";

    const pre = document.createElement("pre");
    pre.className = "prose-pre";
    pre.innerHTML = this.__html;
    container.appendChild(pre);

    const copyButton = document.createElement("button");
    copyButton.className =
      "icon-button absolute -top-4 right-2 opacity-70 group-hover:opacity-100 focus:opacity-100 transition-opacity z-10";
    copyButton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

    const feedback = document.createElement("span");
    feedback.className =
      "absolute -top-4 right-12 bg-green-600 text-white text-xs px-2 py-1 rounded shadow hidden";
    feedback.textContent = "Copied!";

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(this.__code);
        feedback.classList.remove("hidden");
        setTimeout(() => feedback.classList.add("hidden"), 2000);
      } catch (e) {
        console.error("Failed to copy code:", e);
      }
    });

    const expandButton = document.createElement("button");
    expandButton.className =
      "icon-button absolute top-2 right-2 opacity-70 group-hover:opacity-100 focus:opacity-100 transition-opacity z-10";
    expandButton.innerHTML =
      '<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="12" height="12" rx="2" /></svg>';

    expandButton.addEventListener("click", () => {
      const { openModal } = window.__codeModalContext || {
        openModal: () => {},
      };
      openModal(this.__code, this.__language);
    });

    container.appendChild(copyButton);
    container.appendChild(feedback);
    container.appendChild(expandButton);

    return container;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return null;
  }

  exportJSON() {
    return {
      type: "prism-code-highlight",
      html: this.__html,
      code: this.__code,
      language: this.__language,
      version: 1,
    };
  }
}

export function $createPrismCodeHighlightNode(
  code: string,
  language: string
): PrismCodeHighlightNode {
  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.text,
    language
  );
  const html = `<code class="language-${language}">${highlightedCode}</code>`;
  return new PrismCodeHighlightNode(html, code, language);
}

declare global {
  interface Window {
    __codeModalContext?: { openModal: (code: string, language: string) => void };
  }
}