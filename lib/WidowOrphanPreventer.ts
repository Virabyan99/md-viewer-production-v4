import { LexicalEditor } from "lexical";

export const WidowOrphanPreventer = {
  init: (editor: LexicalEditor) => {
    const preventWidows = () => {
      editor.update(() => {
        const root = editor.getRootElement();
        if (!root) return;
        root.querySelectorAll("p").forEach((p) => {
          const words = p.textContent?.trim().split(/\s+/) ?? [];
          if (words.length < 4) return; // Skip short paragraphs
          const lastTwo = words.slice(-2).join(" "); // Non-breaking space
          const first = words.slice(0, -2).join(" ");
          p.innerHTML = `${first} <span class="no-widow">${lastTwo}</span>`;
        });
      });
    };
    return editor.registerUpdateListener(preventWidows);
  },
};