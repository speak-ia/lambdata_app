import { getPendingUploads, offlineDb } from "./db";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function syncPendingUploads(token?: string | null) {
  if (!offlineDb || !navigator.onLine) return { synced: 0, failed: 0 };

  const pending = await getPendingUploads();
  let synced = 0;
  let failed = 0;

  for (const item of pending) {
    try {
      await offlineDb.uploads.update(item.id, { status: "uploading" });
      const res = await fetch(`${API_URL}/api/v1/contributions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(item.payload),
      });
      if (!res.ok) throw new Error("Upload failed");
      await offlineDb.uploads.update(item.id, { status: "done" });
      synced++;
    } catch {
      await offlineDb.uploads.update(item.id, {
        status: "failed",
        retries: item.retries + 1,
      });
      failed++;
    }
  }

  return { synced, failed };
}
