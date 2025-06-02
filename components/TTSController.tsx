"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, CircleStop } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  containerId: string; // ID of the element containing the rendered markdown
}

export function TTSController({ containerId }: Props) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [fullText, setFullText] = useState("");
  const [startOffset, setStartOffset] = useState(0);
  const [lastCharIndex, setLastCharIndex] = useState(0);
  const t = useTranslations("tts");

  useEffect(() => {
    setMounted(true);
  }, []);

  const getSelectedText = () => window?.getSelection()?.toString().trim() ?? "";

  const speak = (text: string, offset: number) => {
    if (!synth) return;
    if (synth.speaking) synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    utter.pitch = 1.1;
    utter.volume = 0.85;

    utter.onboundary = (e) => {
      if (e.name === "word") {
        setLastCharIndex(e.charIndex);
        highlightWord(offset + e.charIndex);
      }
    };

    utter.onend = () => {
      clearHighlights();
      setPlaying(false);
      setPaused(false);
      setLastCharIndex(0);
    };

    utterRef.current = utter;
    synth.speak(utter);
    setPlaying(true);
    setPaused(false);
  };

  const handleSpeak = () => {
    if (playing) {
      stop();
    } else {
      const containerText = document.getElementById(containerId)?.innerText || "";
      setFullText(containerText);
      const selected = getSelectedText();
      let textToSpeak = containerText;
      let offset = 0;

      if (selected) {
        const start = containerText.indexOf(selected);
        if (start !== -1) {
          textToSpeak = selected;
          offset = start;
        }
      }

      setStartOffset(offset);
      speak(textToSpeak, offset);
    }
  };

  const togglePlay = () => {
    if (!synth || !utterRef.current) return;
    if (synth.paused) {
      synth.resume();
      setPaused(false);
    } else if (synth.speaking) {
      synth.pause();
      setPaused(true);
    }
  };

  const stop = () => {
    if (synth) {
      synth.cancel();
      setPlaying(false);
      setPaused(false);
      setLastCharIndex(0);
      clearHighlights();
    }
  };

  const highlightWord = (idx: number) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const range = document.createRange();
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let offset = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (idx < offset + node.length) {
        range.setStart(node, idx - offset);
        range.setEnd(node, idx - offset + 1);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
        break;
      }
      offset += node.length;
    }
  };

  const clearHighlights = () => window.getSelection()?.removeAllRanges();

  // Handle rate changes during playback
  useEffect(() => {
    if (playing && !paused && synth && utterRef.current) {
      synth.cancel();
      const remainingText = fullText.slice(startOffset + lastCharIndex);
      speak(remainingText, startOffset + lastCharIndex);
    }
  }, [rate]);

  if (!mounted) return null;

  const hasText = !!document.getElementById(containerId)?.innerText;

  return (
    <div className="flex items-center gap-2 rounded border bg-surface-50 p-2 dark:bg-surface-900/40">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSpeak}
        aria-pressed={playing}
        disabled={!hasText}
      >
        {playing ? t("stop") : t("speak")}
      </Button>
      {playing && (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={togglePlay}
            aria-label={paused ? t("resume") : t("pause")}
          >
            {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
          </Button>
          <Button size="icon" variant="ghost" onClick={stop} aria-label={t("stop")}>
            <CircleStop className="size-5" />
          </Button>
        </>
      )}
      <label className="flex items-center gap-2 text-sm">
        <span id="rate-label">{t("speed")}</span>
        <Slider
          aria-labelledby="rate-label"
          min={0.5}
          max={2}
          step={0.25}
          value={[rate]}
          onValueChange={(v) => setRate(v[0])}
          className="w-40"
        />
        <span>{rate.toFixed(2)}×</span>
      </label>
    </div>
  );
}