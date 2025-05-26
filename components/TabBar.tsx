"use client";

import { useStore } from "zustand";
import { useTabStore } from "@/lib/tabStore";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";

export function TabBar() {
  const { tabs, activeId, setActive, closeTab, reorder } = useStore(useTabStore);
  const containerRef = useRef<HTMLDivElement>(null);

  if (tabs.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1 overflow-x-auto border-b bg-muted/30 px-2 py-2"
    >
      {tabs.map((tab, index) => (
        <DraggableTab
          key={tab.id}
          index={index}
          tab={tab}
          active={tab.id === activeId}
          onActivate={() => setActive(tab.id)}
          onClose={() => closeTab(tab.id)}
          onReorder={reorder}
          container={containerRef}
        />
      ))}
    </div>
  );
}

function DraggableTab({
  tab,
  index,
  active,
  onActivate,
  onClose,
  onReorder,
  container,
}: {
  tab: { id: number; title: string };
  index: number;
  active: boolean;
  onActivate(): void;
  onClose(): void;
  onReorder(from: number, to: number): void;
  container: React.RefObject<HTMLDivElement>;
}) {
  const [{ x, zIndex }, api] = useSpring(() => ({ x: 0, zIndex: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx] }) => {
      const el = container.current;
      if (!el) return;
      api.start({ x: down ? mx : 0, immediate: down, zIndex: down ? 10 : 0 });

      const siblings = Array.from(el.children) as HTMLElement[];
      const width = siblings[index].offsetWidth;

      const newIndex = Math.min(
        siblings.length - 1,
        Math.max(0, Math.round((index * width + mx) / width)),
      );
      if (newIndex !== index) onReorder(index, newIndex);
      if (!down) api.start({ x: 0 });
    },
    { axis: "x", filterTaps: true },
  );

  return (
    <animated.div style={{ x, zIndex }} {...bind()}>
      <Button
        role="tab"
        aria-selected={active}
        variant="ghost"
        size="sm"
        className={clsx(
          "group relative rounded-md px-3 py-1.5",
          active && "bg-primary/10 font-semibold",
        )}
        onClick={onActivate}
      >
        <span className="truncate max-w-[8rem]">{tab.title}</span>
        <IconX
          aria-label="Close tab"
          className="ml-2 size-4 shrink-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      </Button>
    </animated.div>
  );
}