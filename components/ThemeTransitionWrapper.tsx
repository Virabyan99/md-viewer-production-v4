"use client";

import { useThemeTransition } from "@/lib/useThemeTransition";
import { ReactNode } from "react";
import { animated } from "@react-spring/web"; // Import animated

export function ThemeTransitionWrapper({ children }: { children: ReactNode }) {
  const styles = useThemeTransition(); // Returns animated styles
  return <animated.div style={styles}>{children}</animated.div>; // Use animated.div
}