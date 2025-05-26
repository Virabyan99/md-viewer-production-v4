import { StateCreator } from "zustand";
import { db } from "./db";
import type { TabState } from "./tabStore";

export const persistTabs =
  (config: StateCreator<TabState>): StateCreator<TabState> =>
  (set, get, api) => {
    // Hydrate from IndexedDB on init
    (async () => {
      const storedTabs = await db.tabs.toArray();
      if (storedTabs.length) {
        const sortedTabs = storedTabs.sort((a, b) => a.lastUsed - b.lastUsed);
        set({
          tabs: sortedTabs,
          activeId: sortedTabs.at(-1)!.id,
        });
      }
    })();

    // Wrap store with persistence
    const bound = config((state) => {
      set(state);
      queueMicrotask(async () => {
        const { tabs } = get();
        await db.transaction("rw", db.tabs, async () => {
          await db.tabs.clear();
          await db.tabs.bulkAdd(tabs);
        });
      });
    }, get, api);

    return bound;
  };