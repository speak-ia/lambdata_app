import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseApp } from "./config";
import type { UserProfile } from "@/types";

function getAuthInstance() {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error(
      "Firebase n'est pas configuré. Vérifiez les variables NEXT_PUBLIC_FIREBASE_* dans .env.local",
    );
  }
  return getAuth(app);
}

export function mapFirebaseUser(user: User, displayNameOverride?: string): UserProfile {
  return {
    id: user.uid,
    email: user.email ?? undefined,
    displayName:
      displayNameOverride ??
      user.displayName ??
      user.email?.split("@")[0] ??
      "Contributeur",
    avatarUrl: user.photoURL ?? undefined,
    country: "SN",
    ethnicity: "",
    languages: [],
    profileCompleted: false,
    level: 1,
    xp: 0,
    xpToNextLevel: 10000,
    agreements: 0,
    contributions: 0,
    badges: [],
    streak: 0,
    isGuest: false,
  };
}

function mapAuthError(code: string): string {
  const messages: Record<string, string> = {
    "auth/invalid-email": "Adresse e-mail invalide.",
    "auth/user-disabled": "Ce compte est désactivé.",
    "auth/user-not-found": "Aucun compte avec cet e-mail.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/invalid-credential": "E-mail ou mot de passe incorrect.",
    "auth/email-already-in-use": "Cet e-mail est déjà utilisé.",
    "auth/weak-password": "Mot de passe trop faible (6 caractères minimum).",
    "auth/popup-closed-by-user": "Connexion Google annulée.",
    "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard.",
    "auth/network-request-failed": "Problème réseau. Vérifiez votre connexion.",
  };
  return messages[code] ?? "Erreur d'authentification.";
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    getAuthInstance(),
    email.trim(),
    password,
  );
  const token = await credential.user.getIdToken();
  return {
    user: mapFirebaseUser(credential.user),
    token,
  };
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
) {
  const credential = await createUserWithEmailAndPassword(
    getAuthInstance(),
    email.trim(),
    password,
  );
  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  const token = await credential.user.getIdToken();
  return {
    user: mapFirebaseUser(credential.user, displayName.trim() || undefined),
    token,
  };
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const credential = await signInWithPopup(getAuthInstance(), provider);
  const token = await credential.user.getIdToken();
  return {
    user: mapFirebaseUser(credential.user),
    token,
  };
}

export async function signOutFirebase() {
  const auth = getAuthInstance();
  if (auth.currentUser) {
    await signOut(auth);
  }
}

export { getAuthInstance as getClientAuth };

export function getAuthErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code: string }).code === "string"
  ) {
    return mapAuthError((error as { code: string }).code);
  }
  if (error instanceof Error) return error.message;
  return "Une erreur est survenue.";
}
