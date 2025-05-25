import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Tab {
  id: number; // Dexie file id
  title: string;
  lastUsed: number; // ms epoch
}

interface TabState {
  tabs: Tab[];
  activeId: number | null;
  openTab: (id: number, title: string) => void;
  closeTab: (id: number) => void;
  setActive: (id: number) => void;
}

const MAX_TABS = 10;

export const useTabStore = create<TabState>()(
  immer((set) => ({
    tabs: [],
    activeId: null,

    openTab: (id, title) =>
      set((draft) => {
        // Remove if already open
        draft.tabs = draft.tabs.filter((t) => t.id !== id);
        // Add new tab to end (most recently used)
        draft.tabs.push({ id, title, lastUsed: Date.now() });
        draft.activeId = id;

        // Evict oldest tab if over limit
        if (draft.tabs.length > MAX_TABS) {
          draft.tabs.shift(); // Remove least recently used (first tab)
          if (!draft.tabs.some((t) => t.id === draft.activeId)) {
            draft.activeId = draft.tabs.at(-1)!.id;
          }
        }
      }),

    closeTab: (id) =>
      set((draft) => {
        draft.tabs = draft.tabs.filter((t) => t.id !== id);
        if (draft.activeId === id) draft.activeId = draft.tabs.at(-1)?.id ?? null;
      }),

    setActive: (id) =>
      set((draft) => {
        const tab = draft.tabs.find((t) => t.id === id);
        if (!tab) return;
        tab.lastUsed = Date.now();
        draft.activeId = id;
        // Move tab to end for LRU
        draft.tabs = draft.tabs.filter((t) => t.id !== id).concat(tab);
      }),
  }))
);