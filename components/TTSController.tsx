"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, CircleStop } from "lucide-react";
import { useTranslations } from "next-intl";
import { chunkByLanguage } from "@/lib/chunkByLanguage";
import { getPreferredVoice } from "@/lib/voiceRegistry";
import VoicePicker from "@/components/VoicePicker";

interface Props {
  containerId: string;
}

export function TTSController({ containerId }: Props) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [currentCaption, setCurrentCaption] = useState<{ text: string; lang: string } | null>(null);
  const t = useTranslations("tts");

  useEffect(() => {
    setMounted(true);
  }, []);

  const languageMap: Record<string, string> = {
    eng: "en-US",
    spa: "es-ES",
    fra: "fr-FR",
    cmn: "zh-CN",
    zho: "zh-TW",
    jpn: "ja-JP",
    kor: "ko-KR",
    hye: "hy-AM",
    rus: "ru-RU",
    fas: "fa-IR",
    ara: "ar-SA",
    und: "en-US",
  };

  const getSelectedText = () => window?.getSelection()?.toString().trim() ?? "";

  const speak = useCallback((rawText: string) => {
    if (!synth) return;
    synth.cancel();

    const chunks = chunkByLanguage(rawText);

    chunks.forEach(({ text, lang }, idx) => {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = languageMap[lang] || "en-US";

      const voice =
        getPreferredVoice(utter.lang) ??
        synth.getVoices().find(v => v.lang.toLowerCase().startsWith(utter.lang.toLowerCase()));
      if (voice) utter.voice = voice;

      utter.rate = rate;
      utter.pitch = 1.1;
      utter.volume = 0.85;

      utter.onstart = () => setCurrentCaption({ text, lang: utter.lang });

      if (idx === chunks.length - 1) {
        utter.onend = () => {
          setPlaying(false);
          setCurrentCaption(null);
        };
      }

      synth.speak(utter);
    });

    setPlaying(true);
  }, [synth, rate]);

  const handleSpeak = () => {
    if (playing) {
      stop();
    } else {
      const containerText = document.getElementById(containerId)?.innerText || "";
      const selected = getSelectedText();
      const textToSpeak = selected || containerText;
      speak(textToSpeak);
    }
  };

  const togglePlay = () => {
    if (!synth) return;
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
      setCurrentCaption(null);
    }
  };

  if (!mounted) return null;

  const hasText = !!document.getElementById(containerId)?.innerText;

  return (
    <div className="flex items-center gap-2 rounded border bg-surface-50 p-2 dark:bg-surface-900/40">
      <VoicePicker label="Voice" />
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
      {currentCaption && (
        <div
          className="sr-only"
          aria-live="polite"
          data-lang={currentCaption.lang}
        >
          {currentCaption.text}
        </div>
      )}
    </div>
  );
}