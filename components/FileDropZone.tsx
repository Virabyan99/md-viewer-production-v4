"use client";

import { useCallback, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { fileSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { useTabStore } from "@/lib/tabStore";
import { useTheme } from "./ThemeProvider";

export function FileDropZone() {
  const [isOver, setIsOver] = useState(false);
  const animation = useSpring({ transform: isOver ? "scale(1.2)" : "scale(1)" });
  const { theme } = useTheme();
  const iconSrc = theme === 'dark' ? '/transparent_dark.png' : '/transparent_icon.png';

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files);

      for (const file of droppedFiles) {
        const res = fileSchema.safeParse(file);
        if (!res.success) {
          console.warn(res.error.format());
          continue;
        }

        const text = await file.text();
        const record = {
          name: file.name,
          content: text,
          size: file.size,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        const id = await db.files.add(record);
        useTabStore.getState().openTab(id, file.name);
      }
    },
    []
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className="flex h-[64vh] w-full items-center justify-center"
      role="region"
      aria-label="Drag and drop markdown files"
    >
      <animated.img
        style={animation}
        src={iconSrc}
        alt="Drop files here"
        className="w-32 h-32"
      />
    </div>
  );
}