import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persistTabs } from "./persist";

export interface Tab {
  id: number; // Dexie file id
  title: string;
  lastUsed: number; // ms epoch
}

export interface TabState {
  tabs: Tab[];
  activeId: number | null;
  openTab: (id: number, title: string) => void;
  closeTab: (id: number) => void;
  setActive: (id: number) => void;
  reorder: (from: number, to: number) => void;
}

const MAX_TABS = 10;

const storeImpl: StateCreator<TabState> = (set) => ({
  tabs: [],
  activeId: null,

  openTab: (id, title) =>
    set((draft) => {
      const newTab = { id, title, lastUsed: Date.now() };
      draft.tabs.push(newTab);
      draft.activeId = id;
      if (draft.tabs.length > MAX_TABS) {
        const oldestTab = draft.tabs.reduce((oldest, current) =>
          oldest.lastUsed < current.lastUsed ? oldest : current
        );
        draft.tabs = draft.tabs.filter((t) => t.id !== oldestTab.id);
      }
    }),

  closeTab: (id) =>
    set((draft) => {
      const wasActive = draft.activeId === id;
      draft.tabs = draft.tabs.filter((t) => t.id !== id);
      if (wasActive && draft.tabs.length > 0) {
        const mostRecentTab = draft.tabs.reduce((mostRecent, current) =>
          mostRecent.lastUsed > current.lastUsed ? mostRecent : current
        );
        draft.activeId = mostRecentTab.id;
      } else if (draft.tabs.length === 0) {
        draft.activeId = null;
      }
    }),

  setActive: (id) =>
    set((draft) => {
      const tab = draft.tabs.find((t) => t.id === id);
      if (!tab) return;
      tab.lastUsed = Date.now();
      draft.activeId = id;
    }),

  reorder: (from, to) =>
    set((draft) => {
      const [moved] = draft.tabs.splice(from, 1);
      draft.tabs.splice(to, 0, moved);
      moved.lastUsed = Date.now();
      draft.activeId = moved.id;
    }),
});

export const useTabStore = create<TabState>()(immer(persistTabs(storeImpl)));