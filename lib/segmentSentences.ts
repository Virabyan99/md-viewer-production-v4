/**
 * Splits text into an array of sentences, preserving the original order.
 */
export const segmentSentences = (text: string): string[] => {
  const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });
  return Array.from(segmenter.segment(text), seg => seg.segment);
};