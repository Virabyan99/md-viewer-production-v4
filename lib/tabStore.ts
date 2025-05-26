import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persistTabs } from "./persist";

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
  reorder: (from: number, to: number) => void; // New reorder function
}

const MAX_TABS = 10;

const storeImpl: StateCreator<TabState> = (set) => ({
  tabs: [],
  activeId: null,

  openTab: (id, title) =>
    set((draft) => {
      draft.tabs = draft.tabs.filter((t) => t.id !== id);
      draft.tabs.push({ id, title, lastUsed: Date.now() });
      draft.activeId = id;
      if (draft.tabs.length > MAX_TABS) {
        draft.tabs.shift();
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
      draft.tabs = draft.tabs.filter((t) => t.id !== id).concat(tab);
    }),

  reorder: (from, to) =>
    set((draft) => {
      const [moved] = draft.tabs.splice(from, 1);
      draft.tabs.splice(to, 0, moved);
      moved.lastUsed = Date.now(); // Update lastUsed to preserve LRU
      draft.activeId = moved.id;
    }),
});

export const useTabStore = create<TabState>()(immer(persistTabs(storeImpl)));