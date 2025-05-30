"use client";

import { useThemeTransition } from "@/lib/useThemeTransition";
import { ReactNode } from "react";

export function ThemeTransitionWrapper({ children }: { children: ReactNode }) {
  const styles = useThemeTransition(); // Call the hook here, in a client component
  return <div style={styles}>{children}</div>;
}