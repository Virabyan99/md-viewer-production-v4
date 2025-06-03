"use client";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  getVoices,
  onVoicesReady,
  getStoredVoiceURI,
  setStoredVoiceURI,
} from "@/lib/voiceRegistry";

type Props = { label?: string };

export default function VoicePicker({ label = "Voice" }: Props) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedURI, setSelectedURI] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);

  // Load voices when available
  useEffect(() => {
    onVoicesReady(() => setVoices(getVoices()));
    setSelectedURI(getStoredVoiceURI());
  }, []);

  const playSample = (v: SpeechSynthesisVoice) => {
    const utter = new SpeechSynthesisUtterance("Sample text preview.");
    utter.voice = v;
    utter.lang = v.lang;
    utter.onend = () => setPreviewing(null);
    window.speechSynthesis.cancel(); // Stop any current speech
    window.speechSynthesis.speak(utter);
    setPreviewing(v.voiceURI);
  };

  const handleSelect = (uri: string) => {
    setSelectedURI(uri);
    setStoredVoiceURI(uri);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">{label}</Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-h-72 w-72 overflow-y-auto p-0"
        side="bottom"
        align="start"
      >
        <ul role="listbox" aria-label="Available voices" className="divide-y">
          {voices.map((v) => {
            const selected = selectedURI === v.voiceURI;
            return (
              <li key={v.voiceURI} className="p-2">
                <div className="flex items-start justify-between gap-2">
                  <button
                    className={`flex-1 text-left ${selected ? "font-semibold" : ""}`}
                    onClick={() => handleSelect(v.voiceURI)}
                    role="option"
                    aria-selected={selected}
                  >
                    {v.name}
                    <span className="ml-1 text-muted-foreground text-xs">({v.lang})</span>
                  </button>
                  <button
                    className="text-xs underline"
                    onClick={() => playSample(v)}
                    disabled={previewing === v.voiceURI}
                  >
                    {previewing === v.voiceURI ? "Playing…" : "Preview"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}