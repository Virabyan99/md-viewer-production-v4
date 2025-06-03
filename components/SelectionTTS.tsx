"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { useTextSelection } from "@/lib/useTextSelection";
import { chunkByLanguage } from "@/lib/chunkByLanguage";
import { getPreferredVoice } from "@/lib/voiceRegistry";

export default function SelectionTTS() {
  const { selectedText, clear } = useTextSelection();
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (selectedText) {
      const range = window.getSelection()?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setPosition({
          top: rect.bottom + 8,  // Position just below the selection, relative to viewport
          left: rect.right - 40, // Position to the right of the selection, relative to viewport
        });
      }
    } else {
      setPosition(null);
    }
  }, [selectedText]);

  if (!selectedText || !synth || !position) return null;

  const speakSelection = () => {
    synth.cancel();

    const chunks = chunkByLanguage(selectedText);

    chunks.forEach(({ text, lang }, idx) => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;

      const voice =
        getPreferredVoice(lang) ??
        synth.getVoices().find(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
      if (voice) utter.voice = voice;

      utter.rate = 1;
      utter.onend = idx === chunks.length - 1 ? clear : undefined;
      synth.speak(utter);
    });
  };

  return createPortal(
    <Button
      className="fixed z-50 animate-fade-in"
      style={{ top: position.top, left: position.left }}
      size="sm"
      aria-label="Speak selected text"
      onClick={speakSelection}
      onKeyDown={e => {
        if (e.key === "Escape") clear();
      }}
    >
      🔈 Speak
    </Button>,
    document.body
  );
}