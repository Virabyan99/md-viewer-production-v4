"use client";
import { useState } from "react";
import { LexicalViewer } from "@/components/LexicalViewer";
import { FileDropZone } from "@/components/FileDropZone";

export default function ViewerPage() {
  const [fileId, setFileId] = useState<number | null>(null);

  return (
    <>
      <FileDropZone
        onFileStored={(id) => {
          setFileId(id);
        }}
      />
      <div className="mt-8">
        <LexicalViewer initialMarkdown={fileId ? undefined : null} />
      </div>
    </>
  );
}