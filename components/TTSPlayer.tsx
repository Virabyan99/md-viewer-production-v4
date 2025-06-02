"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, CircleStop } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  utter: SpeechSynthesisUtterance | null; // The utterance to control
  synth: SpeechSynthesis | null;          // The speech synthesis instance
}

export function TTSPlayer({ utter, synth }: Props) {
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const t = useTranslations("tts");

  // Toggle between pause and resume
  const togglePlay = () => {
    if (!utter || !synth) return;
    if (synth.paused) {
      synth.resume();
      setPaused(false);
    } else if (synth.speaking) {
      synth.pause();
      setPaused(true);
    }
  };

  // Stop the speech
  const stop = () => {
    if (synth) {
      synth.cancel();
    }
  };

  // Update the utterance rate when the slider changes
  useEffect(() => {
    if (utter) {
      utter.rate = rate;
    }
  }, [rate, utter]);

  if (!utter || !synth) return null;

  return (
    <div
      className="flex items-center gap-2 rounded border bg-surface-50 p-2 dark:bg-surface-900/40"
      role="toolbar"
      aria-label="TTS player controls"
    >
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