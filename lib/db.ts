import Dexie, { Table } from "dexie";

export interface Pref {
  key: string;
  value: string;
}

export interface FileRecord {
  id?: number;
  name: string;
  content: string; // raw markdown
  size: number;
  createdAt: number;
  updatedAt: number;
}

export interface TabRecord {
  id: number;
  title: string;
  lastUsed: number;
}

class ViewerDB extends Dexie {
  prefs!: Table<Pref, string>;
  files!: Table<FileRecord, number>;
  tabs!: Table<TabRecord, number>; // New table for tabs

  constructor() {
    super("viewer-settings");
    this.version(3).stores({
      prefs: "&key",
      files: "++id, name, createdAt",
      tabs: "id, lastUsed", // id mirrors file id
    });
  }
}

export const db = new ViewerDB();

const LOCALE_KEY = "locale";

export async function saveLocale(locale: string) {
  await db.prefs.put({ key: LOCALE_KEY, value: locale });
}

export async function loadLocale(): Promise<string | null> {
  const r = await db.prefs.get(LOCALE_KEY);
  return r?.value ?? null;
}