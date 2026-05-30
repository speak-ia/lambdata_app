import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

/** Retire guillemets / virgules si collés depuis la console Firebase ou Vercel */
function cleanEnv(value?: string): string | undefined {
  if (!value) return undefined;
  let v = value.trim().replace(/,\s*$/, "");
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v || undefined;
}

function getFirebaseConfig() {
  const apiKey = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  const authDomain = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  const projectId = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const storageBucket = cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  );
  const messagingSenderId = cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  );
  const appId = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseConfig() !== null;
}

export function getFirebaseApp(): FirebaseApp | null {
  const config = getFirebaseConfig();
  if (!config) return null;
  return getApps().length > 0 ? getApp() : initializeApp(config);
}
