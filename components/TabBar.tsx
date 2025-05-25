"use client";

import { useStore } from "zustand";
import { useTabStore } from "@/lib/tabStore";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";

export function TabBar() {
  const { tabs, activeId, setActive, closeTab } = useStore(useTabStore, (s) => s);

  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b bg-muted/30 px-2 py-2">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          size="sm"
          className={clsx(
            "group relative rounded-md px-3 py-1.5",
            activeId === tab.id && "bg-primary/10 font-semibold"
          )}
          onClick={() => setActive(tab.id)}
        >
          <span className="truncate max-w-[8rem]">{tab.title}</span>
          <IconX
            aria-label="Close tab"
            className="ml-2 size-4 shrink-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
          />
        </Button>
      ))}
    </div>
  );
}