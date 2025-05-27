"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { fileSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { IconUpload } from "@tabler/icons-react";
import { useTabStore } from "@/lib/tabStore";

export function FilePicker() {
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
      useTabStore.getState().openTab(id, file.name);
    }
    e.target.value = "";
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="justify-center size-8"
      >
        <IconUpload className="size-5" />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleChange}
        className="sr-only"
      />
    </>
  );
}