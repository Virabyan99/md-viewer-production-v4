"use client";

import { createContext, useContext, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ViewerPlugin } from "@/lib/types";

const PluginCtx = createContext<ViewerPlugin[]>([]);

export const usePlugins = () => useContext(PluginCtx);

export function PluginProvider({
  plugins,
  children,
}: {
  plugins: ViewerPlugin[];
  children: React.ReactNode;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const disposers = plugins.map((p) => p.init(editor)).filter(Boolean) as (() => void)[];
    return () => disposers.forEach((d) => d());
  }, [editor, plugins]);

  return <PluginCtx.Provider value={plugins}>{children}</PluginCtx.Provider>;
}