"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LambdataLogo } from "@/components/branding/lambdata-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MobileConnectPage() {
  const [appUrl, setAppUrl] = useState("");
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  useEffect(() => {
    setAppUrl(window.location.origin);
  }, []);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col gap-6 px-4 py-8 pattern-waves">
      <LambdataLogo size="lg" />
      <div>
        <h1 className="font-heading text-xl font-bold">Test sur mobile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dans le terminal, la ligne{" "}
          <strong className="text-foreground">Network</strong> n&apos;est pas
          une page du routeur : c&apos;est l&apos;adresse de votre app sur le
          Wi‑Fi. Ouvrez exactement cette URL sur le téléphone.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            URL de l&apos;app (à ouvrir sur le téléphone)
          </p>
          <p className="break-all font-mono text-sm font-semibold text-primary">
            {appUrl || "http://VOTRE_IP:3000"}
          </p>
          {appUrl && (
            <Button variant="outline" size="sm" onClick={() => copy(appUrl)}>
              Copier l&apos;URL app
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            API (configurée dans .env.local)
          </p>
          <p className="break-all font-mono text-sm">{apiUrl}</p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-4 text-sm">
          <p className="font-semibold text-foreground">Icône comme les autres apps</p>
          <p className="text-muted-foreground">
            <strong>iPhone :</strong> Safari uniquement → Partager → « Sur l’écran
            d’accueil ». Guide : <code className="text-foreground">docs/IPHONE-IOS.md</code>
          </p>
          <p className="text-muted-foreground">
            <strong>Android :</strong> Chrome → « Installer l’application », ou{" "}
            <code className="text-foreground">npm run android:open</code>
          </p>
        </CardContent>
      </Card>

      <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
        <li>Mac et téléphone sur le même Wi‑Fi</li>
        <li>Ne pas utiliser <code className="text-foreground">localhost</code> sur le téléphone</li>
        <li>Redémarrer <code className="text-foreground">npm run dev</code> après changement de .env</li>
      </ul>

      <Link
        href="/home"
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground"
      >
        Ouvrir l&apos;application
      </Link>
    </div>
  );
}
