import { db } from "./db";

const THEME_KEY = "theme";

export async function saveTheme(theme: "light" | "dark") {
  await db.prefs.put({ key: THEME_KEY, value: theme });
}

export async function loadTheme(): Promise<"light" | "dark" | null> {
  const pref = await db.prefs.get(THEME_KEY);
  return (pref?.value as "light" | "dark" | undefined) ?? null;
}