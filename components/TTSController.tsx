'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, CircleStop, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { chunkByLanguage } from '@/lib/chunkByLanguage'
import { getPreferredVoice } from '@/lib/voiceRegistry'
import VoicePicker from '@/components/VoicePicker'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'

interface Props {
  containerId: string
}

export function TTSController({ containerId }: Props) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [mounted, setMounted] = useState(false)
  const [hasText, setHasText] = useState(false)
  const [currentCaption, setCurrentCaption] = useState<{
    text: string
    lang: string
  } | null>(null)
  const t = useTranslations('tts')
  const chunksRef = useRef<{ text: string; lang: string }[]>([])
  const currentIndexRef = useRef<number>(0)
  const currentPositionRef = useRef<number>(0)
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Monitor text availability in the DOM
  useEffect(() => {
    const checkText = () => {
      const text = document.getElementById(containerId)?.innerText;
      if (text && text.trim() !== '') {
        setHasText(true);
      }
    };

    checkText(); // Check immediately on mount

    if (!hasText) {
      const interval = setInterval(checkText, 500); // Check every 500ms
      return () => clearInterval(interval); // Cleanup interval
    }
  }, [hasText, containerId]);

  const languageMap: Record<string, string> = {
    eng: 'en-US',
    spa: 'es-ES',
    fra: 'fr-FR',
    cmn: 'zh-CN',
    zho: 'zh-TW',
    jpn: 'ja-JP',
    kor: 'ko-KR',
    hye: 'hy-AM',
    rus: 'ru-RU',
    fas: 'fa-IR',
    ara: 'ar-SA',
    und: 'en-US',
  }

  const getSelectedText = () => window?.getSelection()?.toString().trim() ?? ''

  const speakChunk = useCallback(
    (index: number, startPos: number = 0) => {
      if (!synth || index >= chunksRef.current.length) {
        setPlaying(false)
        setPaused(false)
        setCurrentCaption(null)
        return
      }

      synth.cancel()

      const { text, lang } = chunksRef.current[index]
      const slicedText = text.slice(startPos)

      if (slicedText.trim() === '') {
        currentIndexRef.current++
        currentPositionRef.current = 0
        speakChunk(currentIndexRef.current)
        return
      }

      const utter = new SpeechSynthesisUtterance(slicedText)
      utter.lang = languageMap[lang] || 'en-US'

      const voice =
        getPreferredVoice(utter.lang) ??
        synth
          .getVoices()
          .find((v) =>
            v.lang.toLowerCase().startsWith(utter.lang.toLowerCase())
          )
      if (voice) utter.voice = voice

      utter.rate = rate
      utter.pitch = 1.1
      utter.volume = 0.85

      utter.onstart = () => {
        setCurrentCaption({ text: slicedText, lang: utter.lang })
        setPlaying(true)
        setPaused(false)
      }

      utter.onboundary = (e) => {
        if (e.name === 'word') {
          currentPositionRef.current = startPos + e.charIndex
        }
      }

      utter.onend = () => {
        currentIndexRef.current++
        currentPositionRef.current = 0
        speakChunk(currentIndexRef.current)
      }

      utter.onpause = () => {
        setPaused(true)
        setPlaying(false)
      }

      utter.onerror = (e) => {
        if (e.utterance === currentUtteranceRef.current) {
          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            console.error('SpeechSynthesisUtterance error:', e)
            setPlaying(false)
            setPaused(false)
          }
        }
      }

      currentUtteranceRef.current = utter

      setPlaying(true)
      setPaused(false)
      synth.speak(utter)
    },
    [synth, rate]
  )

  const speak = useCallback(
    (rawText: string) => {
      if (!synth) return
      synth.cancel()
      chunksRef.current = chunkByLanguage(rawText)
      currentIndexRef.current = 0
      currentPositionRef.current = 0
      speakChunk(0)
    },
    [synth, rate, speakChunk]
  )

  const pauseSpeech = () => {
    if (synth && synth.speaking) {
      synth.pause()
      setPaused(true)
      setPlaying(false)
    }
  }

  const resumeSpeech = () => {
    if (!synth) return

    if (synth.paused) {
      synth.resume()
      setTimeout(() => {
        if (synth.speaking) {
          setPaused(false)
          setPlaying(true)
        } else {
          speakChunk(currentIndexRef.current, currentPositionRef.current)
        }
      }, 100)
    } else if (paused) {
      speakChunk(currentIndexRef.current, currentPositionRef.current)
    }
  }

  const stopSpeech = () => {
    if (synth) {
      synth.cancel()
      setPlaying(false)
      setPaused(false)
      setCurrentCaption(null)
      currentIndexRef.current = 0
      currentPositionRef.current = 0
    }
  }

  const handleSpeak = () => {
    if (playing) {
      pauseSpeech()
    } else if (paused) {
      resumeSpeech()
    } else {
      const containerText =
        document.getElementById(containerId)?.innerText || ''
      const selected = getSelectedText()
      const textToSpeak = selected || containerText
      speak(textToSpeak)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSpeak}
              aria-label={playing ? t('pause') : paused ? t('resume') : t('speak')}
              disabled={!hasText}
            >
              {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {playing ? t('pause') : paused ? t('resume') : t('speak')}
          </TooltipContent>
        </Tooltip>
        {(playing || paused) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={stopSpeech}
                aria-label={t('stop')}
              >
                <CircleStop className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {t('stop')}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="TTS Settings">
            <Settings className="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <VoicePicker label="Voice" />
            <label className="flex items-center gap-2 text-sm">
              <span id="rate-label">{t('speed')}</span>
              <Slider
                aria-labelledby="rate-label"
                min={0.5}
                max={2}
                step={0.25}
                value={[rate]}
                onValueChange={(v) => setRate(v[0])}
                className="w-full"
              />
              <span>{rate.toFixed(2)}×</span>
            </label>
          </div>
        </PopoverContent>
      </Popover>
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
  )
}