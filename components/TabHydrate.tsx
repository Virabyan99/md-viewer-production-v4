"use client";

import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { useTabStore } from "@/lib/tabStore";

export function TabHydrate({ children }: { children: React.ReactNode }) {
  const hydrated = useStore(useTabStore, (s) => s.tabs.length > 0 || s.activeId === null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}