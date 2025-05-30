"use client";

import { useCallback, useState, useRef } from "react";
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
  
  // Create a ref for the file input
  const inputRef = useRef<HTMLInputElement>(null);

  // Common function to process files (for both drop and click)
  const processFiles = async (files: File[]) => {
    for (const file of files) {
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
  };

  // Handle files dropped via drag-and-drop
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      await processFiles(droppedFiles);
    },
    []
  );

  // Handle files selected via click
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files ?? []);
      await processFiles(selectedFiles);
      e.target.value = ''; // Clear the input to allow re-selection
    },
    []
  );

  return (
    <div
      onClick={() => inputRef.current?.click()} // Trigger file input on click
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className="flex h-[81vh] w-full items-center justify-center"
      role="region"
      aria-label="Drag and drop or click to upload markdown files" // Updated for accessibility
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }} // Hide the input
        multiple // Allow multiple file selection
        accept=".md,.markdown,.txt" // Restrict to Markdown files
        onChange={handleFileSelect} // Handle file selection
      />
      <animated.img
        style={animation}
        src={iconSrc}
        alt="Drop files here"
        className="w-32 h-32"
      />
    </div>
  );
}