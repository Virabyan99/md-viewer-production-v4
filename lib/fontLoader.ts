import { franc } from "franc";

const langToFont: Record<string, () => Promise<void>> = {
  cmn: () => import("@fontsource/noto-sans-sc").then(() => {}),
  zho: () => import("@fontsource/noto-sans-tc").then(() => {}),
  jpn: () => import("@fontsource/noto-sans-jp").then(() => {}),
  kor: () => import("@fontsource/noto-sans-kr").then(() => {}),
  hye: () => import("@fontsource/noto-sans-armenian").then(() => {}),
  rus: () => import("@fontsource/noto-sans").then(() => {}),
  fas: () => import("@fontsource/noto-naskh-arabic").then(() => {}),
  ara: () => import("@fontsource/noto-naskh-arabic").then(() => {}),
  hin: () => import("@fontsource/noto-sans").then(() => {}),
};

const loaded = new Set<string>();
const RTL_LANGS = ["fas", "ara"];

export async function ensureFontFor(text: string) {
  if (/^[-\u00ff]*$/.test(text)) return;

  const lang = franc(text, { minLength: 10 });
  const load = langToFont[lang];
  if (load && !loaded.has(lang)) {
    await load();
    loaded.add(lang);
    document.documentElement.classList.add(`font-${lang}`);
    if (RTL_LANGS.includes(lang)) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }
}