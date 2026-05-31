import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  type UploadMetadata,
} from "firebase/storage";
import { getFirebaseApp } from "./config";

function getStorageInstance() {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase non configuré");
  }
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim();
  if (!bucket) {
    throw new Error(
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET manquant dans .env.local",
    );
  }
  return getStorage(app);
}

export function isFirebaseStorageConfigured(): boolean {
  return (
    !!getFirebaseApp() &&
    !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim()
  );
}

/**
 * Envoie une image culturelle vers Google Cloud Storage (bucket Firebase).
 * Chemin : cultural-images/{userId}/{timestamp}-{id}.{ext}
 */
export async function uploadCulturalImage(
  file: File,
  userId: string,
  category: string,
): Promise<{ downloadUrl: string; storagePath: string }> {
  const storage = getStorageInstance();
  const safeCategory = category.replace(/[^a-z0-9_-]/gi, "_").slice(0, 40);
  const ext =
    file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "jpg";
  const storagePath = `cultural-images/${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const metadata: UploadMetadata = {
    contentType: file.type || "image/jpeg",
    customMetadata: {
      category: safeCategory,
      module: "image",
    },
  };

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file, metadata);
  const downloadUrl = await getDownloadURL(storageRef);

  return { downloadUrl, storagePath };
}
