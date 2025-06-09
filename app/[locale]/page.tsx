"use client";
import { useEffect, useState, useCallback } from "react";
import { LexicalViewer } from "@/components/LexicalViewer";
import dynamic from "next/dynamic";
import { TabBar } from "@/components/TabBar";
import { TabHydrate } from "@/components/TabHydrate";
import { useTabStore } from "@/lib/tabStore";
import { db } from "@/lib/db";
import { CodeModalProvider } from "@/components/CodeModalContext";
import { FullscreenCodeModal } from "@/components/FullscreenCodeModal";
import { CodeModalInitializer } from "@/components/CodeModalInitializer";
import SelectionTTS from "@/components/SelectionTTS";
import { fileSchema } from "@/lib/validation";

const FileDropZone = dynamic(() => import("@/components/FileDropZone").then(mod => mod.FileDropZone), {
  ssr: false,
});

export default function ViewerPage() {
  const [activeId, setActiveId] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [markdown, setMarkdown] = useState<string | null>(null);

  useEffect(() => {
    setActiveId(useTabStore.getState().activeId);
    setTabs(useTabStore.getState().tabs);

    const unsubscribe = useTabStore.subscribe((state) => {
      setActiveId(state.activeId);
      setTabs(state.tabs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeId) {
      db.files.get(activeId).then((record) => {
        if (record) {
          setMarkdown(record.content);
        }
      });
    } else {
      setMarkdown(null);
    }
  }, [activeId]);

  const processFiles = async (files: File[]) => {
    for (const file of files) {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
      };
      const res = fileSchema.safeParse(fileData);
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

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      await processFiles(droppedFiles);
    },
    []
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <CodeModalProvider>
      <CodeModalInitializer />
      <TabHydrate>
        <TabBar />
        <div className="py-8 pl-15 h-full" onDrop={handleDrop} onDragOver={handleDragOver}>
          {tabs.length === 0 ? (
            <div className="flex flex-col cursor-pointer items-center justify-center gap-4">
              <FileDropZone />
            </div>
          ) : (
            <div className="space-y-4">
              <div id="viewer-content" className="mx-auto max-w-4xl">
                <LexicalViewer markdown={markdown} />
              </div>
              <SelectionTTS />
            </div>
          )}
        </div>
      </TabHydrate>
      <FullscreenCodeModal />
    </CodeModalProvider>
  );
}