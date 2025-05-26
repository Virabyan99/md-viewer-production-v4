"use client";
import { useState } from "react";
import { LexicalViewer } from "@/components/LexicalViewer";
import { FileDropZone } from "@/components/FileDropZone";
import { FilePicker } from "@/components/FilePicker";
import { TabBar } from "@/components/TabBar";
import { TabHydrate } from "@/components/TabHydrate";
import { useTabStore } from "@/lib/tabStore";
import { db } from "@/lib/db";

export default function ViewerPage() {
  const [fileId, setFileId] = useState<number | null>(null);

  const handleFileStored = async (id: number) => {
    const record = await db.files.get(id);
    if (!record) return;
    useTabStore.getState().openTab(id, record.name);
    setFileId(id);
  };

  return (
    <TabHydrate>
      <TabBar />
      <div className="mt-4 flex gap-4">
        <FilePicker onFileStored={handleFileStored} />
        <FileDropZone onFileStored={handleFileStored} />
      </div>
      <div className="mt-8">
        <LexicalViewer initialMarkdown={fileId ? undefined : null} />
      </div>
    </TabHydrate>
  );
}