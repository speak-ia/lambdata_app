"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LambdataLogo } from "@/components/branding/lambdata-logo";
import { useAuthStore } from "@/store/auth-store";
import { APP_TAGLINE } from "@/lib/constants";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import {
  getAuthErrorMessage,
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutFirebase,
} from "@/lib/firebase/auth";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { setUser, setTokens, loginAsGuest, setLoading, isLoading } =
    useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const firebaseReady = isFirebaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseReady) {
      toast.error("Firebase non configuré (.env.local)");
      return;
    }
    if (!email.trim() || !password) {
      toast.error("Renseignez l'e-mail et le mot de passe");
      return;
    }
    if (mode === "register" && !name.trim()) {
      toast.error("Choisissez un pseudo");
      return;
    }

    setLoading(true);
    try {
      const result =
        mode === "login"
          ? await signInWithEmail(email, password)
          : await registerWithEmail(email, password, name);
      setUser(result.user);
      setTokens(result.token);
      toast.success(mode === "login" ? "Connexion réussie" : "Compte créé");
      router.push("/home");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!firebaseReady) {
      toast.error("Firebase non configuré (.env.local)");
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      setUser(result.user);
      setTokens(result.token);
      toast.success("Connexion Google réussie");
      router.push("/home");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    if (firebaseReady) {
      try {
        await signOutFirebase();
      } catch {
        /* session déjà vide */
      }
    }
    loginAsGuest();
    toast.info("Mode invité activé");
    router.push("/home");
  };

  return (
    <div className="flex min-h-dvh flex-col justify-center gap-8 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <LambdataLogo size="splash" priority />
        <p className="max-w-xs text-sm text-muted-foreground">{APP_TAGLINE}</p>
      </div>

      {!firebaseReady && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
          Variables Firebase manquantes. Copiez{" "}
          <code className="text-xs">.env.example</code> vers{" "}
          <code className="text-xs">.env.local</code>.
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "register" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Pseudo</Label>
            <Input
              id="name"
              placeholder="Votre pseudo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="h-12 text-base"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="h-12 text-base"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            className="h-12 text-base"
            minLength={6}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="mt-2 h-12 w-full text-base font-semibold"
          disabled={isLoading || !firebaseReady}
        >
          {isLoading
            ? "Chargement…"
            : mode === "login"
              ? "Se connecter"
              : "Créer un compte"}
        </Button>
      </form>

      <div className="relative flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">ou</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 w-full"
          disabled={isLoading || !firebaseReady}
          onClick={handleGoogle}
        >
          Continuer avec Google
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="h-12 w-full text-muted-foreground"
          disabled={isLoading}
          onClick={handleGuest}
        >
          Continuer en invité
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            Pas de compte ?{" "}
            <Link href="/register" className="font-medium text-primary">
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit ?{" "}
            <Link href="/login" className="font-medium text-primary">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
