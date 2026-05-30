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
import type { UserProfile } from "@/types";

const DEMO_USER: UserProfile = {
  id: "demo-1",
  email: "demo@lambdata.africa",
  displayName: "Aminata Diallo",
  country: "SN",
  languages: ["fr", "wo"],
  level: 12,
  xp: 5200,
  xpToNextLevel: 10000,
  agreements: 1240,
  contributions: 890,
  badges: [],
  streak: 7,
  isGuest: false,
};

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: brancher sur API NestJS
      await new Promise((r) => setTimeout(r, 600));
      setUser({
        ...DEMO_USER,
        displayName: name || DEMO_USER.displayName,
        email: email || DEMO_USER.email,
      });
      setTokens("demo-token", "demo-refresh");
      toast.success(mode === "login" ? "Connexion réussie" : "Compte créé");
      router.push("/home");
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
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
          <Label htmlFor="email">Email ou téléphone</Label>
          <Input
            id="email"
            type="text"
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
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="mt-2 h-12 w-full text-base font-semibold"
          disabled={isLoading}
        >
          {isLoading
            ? "Chargement…"
            : mode === "login"
              ? "Se connecter"
              : "Créer un compte"}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 w-full"
          onClick={() => toast.info("Google OAuth — à connecter")}
        >
          Continuer avec Google
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="h-12 w-full"
          onClick={() => toast.info("OTP SMS — à connecter")}
        >
          Connexion par SMS (OTP)
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="h-12 w-full text-muted-foreground"
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
