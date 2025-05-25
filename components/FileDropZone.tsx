"use client";

import { useCallback, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { fileSchema } from "@/lib/validation";
import { db } from "@/lib/db";

interface Props {
  onFileStored?: (id: number) => void;
}

export function FileDropZone({ onFileStored }: Props) {
  const [isOver, setIsOver] = useState(false);
  const animation = useSpring({ scale: isOver ? 1.05 : 1, opacity: isOver ? 0.8 : 1 });

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
        onFileStored?.(id);
      }
    },
    [onFileStored],
  );

  return (
    <animated.div
      style={animation}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className="flex h-32 w-full items-center justify-center rounded border-2 border-dashed border-muted-foreground/40 bg-muted/30 text-sm text-muted-foreground"
      role="region"
      aria-label="Drag and drop markdown files"
    >
      <p>Drop <code>.md</code> / <code>.markdown</code> / <code>.txt</code> here</p>
    </animated.div>
  );
}