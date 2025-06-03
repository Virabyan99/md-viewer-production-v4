import { useEffect, useState } from "react";

export const useTextSelection = () => {
  const [selectedText, setSelectedText] = useState<string>("");

  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (!sel) return;
      const text = sel.toString().trim();
      setSelectedText(text);
    };

    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

  const clear = () => {
    const sel = window.getSelection();
    if (sel?.removeAllRanges) sel.removeAllRanges();
    setSelectedText("");
  };

  return { selectedText, clear };
};