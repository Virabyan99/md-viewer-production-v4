// lib/metadata.ts
import { getMessages } from "next-intl/server";
import type { Metadata } from "next";

export async function getMetadata(locale: string): Promise<Metadata> {
  const messages = await getMessages({ locale });
  // Create a simple translation function with a fallback
  const t = (key: string) => (messages[key as keyof typeof messages] as string) || key;

  return {
    title: {
      default: t("metadata.title.default"),
      template: t("metadata.title.template"),
    },
    description: t("metadata.description"),
  };
}