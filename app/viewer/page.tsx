"use client";
import { useEffect, useState } from "react";
import { LexicalViewer } from "@/components/LexicalViewer";
import dynamic from "next/dynamic";
import { TabBar } from "@/components/TabBar";
import { TabHydrate } from "@/components/TabHydrate";
import { useTabStore } from "@/lib/tabStore";
import { db } from "@/lib/db";

// Dynamically import FileDropZone with SSR disabled, accessing the named export
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

  return (
    <TabHydrate>
    <TabBar />
    <div className="py-8">
      {tabs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <FileDropZone />
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">
          <LexicalViewer markdown={markdown} />
        </div>
      )}
    </div>
  </TabHydrate>
  );
}