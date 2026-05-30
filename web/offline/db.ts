import Dexie, { type Table } from "dexie";
import type { OfflineUploadItem } from "@/types";

export class LambdataOfflineDB extends Dexie {
  uploads!: Table<OfflineUploadItem, string>;
  cache!: Table<{ key: string; value: unknown; updatedAt: number }, string>;

  constructor() {
    super("lambdata-offline");
    this.version(1).stores({
      uploads: "id, module, status, createdAt",
      cache: "key, updatedAt",
    });
  }
}

export const offlineDb = typeof window !== "undefined" ? new LambdataOfflineDB() : null;

export async function queueUpload(item: Omit<OfflineUploadItem, "id" | "createdAt" | "retries" | "status">) {
  if (!offlineDb) return null;
  const id = crypto.randomUUID();
  await offlineDb.uploads.add({
    ...item,
    id,
    createdAt: Date.now(),
    retries: 0,
    status: "pending",
  });
  return id;
}

export async function getPendingUploads() {
  if (!offlineDb) return [];
  return offlineDb.uploads.where("status").anyOf(["pending", "failed"]).toArray();
}
