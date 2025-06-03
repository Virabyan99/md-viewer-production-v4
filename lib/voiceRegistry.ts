/**
 * Returns the list of SpeechSynthesisVoices, sorted by language then name.
 * Guarantees a stable reference unless the underlying list changes.
 */
export const getVoices = (): SpeechSynthesisVoice[] => {
  const voices = window.speechSynthesis.getVoices();
  return voices
    .slice()
    .sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
};

/**
 * Listen for late voice availability (e.g., Chrome lazy-loads voices).
 */
export const onVoicesReady = (cb: () => void) => {
  if (getVoices().length) {
    cb();
  } else {
    window.speechSynthesis.addEventListener("voiceschanged", cb, { once: true });
  }
};

/**
 * Retrieve the user's persisted preferred voice URI from localStorage.
 */
export const getStoredVoiceURI = (): string | null =>
  window.localStorage.getItem("preferredVoiceURI");

/**
 * Persist a preferred voice URI to localStorage.
 */
export const setStoredVoiceURI = (uri: string) =>
  window.localStorage.setItem("preferredVoiceURI", uri);

/**
 * Resolve the preferred voice for a given language, if stored and still present.
 */
export const getPreferredVoice = (lang: string): SpeechSynthesisVoice | undefined => {
  const stored = getStoredVoiceURI();
  const voices = getVoices();
  if (stored) {
    const found = voices.find((v) => v.voiceURI === stored);
    if (found) return found;
  }
  // Fallback to the first voice matching the language
  return voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
};