import Dexie, { Table } from "dexie";

export interface Pref {
  key: string;
  value: string;
}

class ViewerDB extends Dexie {
  prefs!: Table<Pref, string>;

  constructor() {
    super("viewer-settings");
    this.version(1).stores({ prefs: "&key" });
  }
}

export const db = new ViewerDB();