import { useStore } from "zustand";
import { useTabStore } from "./tabStore";
import { db } from "./db";
import { useEffect, useState } from "react";

export function useCurrentFile() {
  const activeId = useStore(useTabStore, (s) => s.activeId);
  const [state, setState] = useState({ filename: "", markdown: "", html: "" });

  useEffect(() => {
    (async () => {
      if (!activeId) {
        setState({ filename: "", markdown: "", html: "" });
        return;
      }
      const rec = await db.files.get(activeId);
      if (!rec) return;
      setState({
        filename: rec.name.replace(/\.(md|markdown|txt)$/i, ""),
        markdown: rec.content,
        html: document.querySelector(".prose")?.innerHTML ?? "",
      });
    })();
  }, [activeId]);

  return state;
}