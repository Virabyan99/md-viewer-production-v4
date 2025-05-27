import {
  TRANSFORMERS as BASE,
  HEADING, // Use the single HEADING transformer
} from "@lexical/markdown";

export const TRANSFORMERS = [
  ...BASE,
  HEADING, // Add HEADING instead of HEADING1, HEADING2, etc.
] as const;