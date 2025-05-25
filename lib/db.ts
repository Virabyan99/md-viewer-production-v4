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

class ViewerDB extends Dexie {
  prefs!: Table<Pref, string>;
  files!: Table<FileRecord, number>; // New table for files

  constructor() {
    super("viewer-settings");
    this.version(2).stores({
      prefs: "&key",
      files: "++id, name, createdAt", // Auto-incrementing ID, indexed fields
    });
  }
}

export const db = new ViewerDB();