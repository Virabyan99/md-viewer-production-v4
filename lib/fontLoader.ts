// lib/fontLoader.ts
import { franc } from "franc";

const langToFont: Record<string, () => Promise<void>> = {
  cmn: () => import("@fontsource/noto-sans-sc").then(() => {}), 
  hin: () => import("@fontsource/noto-sans").then(() => {}),    
  rus: () => import("@fontsource/noto-sans").then(() => {}),    
};

const loaded = new Set<string>();

export async function ensureFontFor(text: string) {
  if (/^[-\u00ff]*$/.test(text)) return; // Skip for Latin text

  const lang = franc(text, { minLength: 10 });
  const load = langToFont[lang];
  if (load && !loaded.has(lang)) {
    await load();
    loaded.add(lang);
    document.documentElement.classList.add(`font-${lang}`);
  }
}