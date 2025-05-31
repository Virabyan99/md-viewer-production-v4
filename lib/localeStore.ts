// lib/localeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { saveLocale, loadLocale } from "@/lib/db";

interface LocaleState {
  locale: string;
  setLocale: (l: string) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en", // Default to English
      setLocale: (l) => {
        set({ locale: l });
        saveLocale(l); // Persist to IndexedDB
      },
    }),
    {
      name: "locale",
      getStorage: () => localStorage, // Optional: could use IndexedDB directly, but localStorage works too
    }
  )
);