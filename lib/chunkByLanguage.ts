import { franc } from "franc";
import { segmentSentences } from "./segmentSentences";

interface Chunk { text: string; lang: string; }

/**
 * Breaks text into language-homogeneous chunks, merging consecutive sentences with the same language.
 */
export const chunkByLanguage = (input: string): Chunk[] => {
  const sentences = segmentSentences(input);
  const chunks: Chunk[] = [];

  const push = (txt: string, lang: string) => {
    if (chunks.length && chunks[chunks.length - 1].lang === lang) {
      chunks[chunks.length - 1].text += " " + txt;
    } else {
      chunks.push({ text: txt, lang });
    }
  };

  for (const s of sentences) {
    // For short sentences (<20 chars), reuse the previous language or default to "en-US"
    const lang =
      s.trim().length < 20
        ? chunks.at(-1)?.lang ?? "en-US"
        : franc(s, { minLength: 10 });

    push(s, lang);
  }
  return chunks;
};