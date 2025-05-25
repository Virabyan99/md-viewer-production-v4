"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { fileSchema } from "@/lib/validation";
import { db } from "@/lib/db";

interface Props {
  onFileStored?: (id: number) => void;
}

export function FilePicker({ onFileStored }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    for (const file of selectedFiles) {
      const res = fileSchema.safeParse(file);
      if (!res.success) {
        console.warn(res.error.format());
        continue;
      }
      const text = await file.text();
      const id = await db.files.add({
        name: file.name,
        content: text,
        size: file.size,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      onFileStored?.(id);
    }
    // Reset input to allow re-selecting the same file
    e.target.value = "";
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="w-40 justify-center"
      >
        Open File
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleChange}
        className="sr-only" // Visually hidden but accessible
      />
    </>
  );
}