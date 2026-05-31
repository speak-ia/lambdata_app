"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TaskShell } from "@/components/tasks/task-shell";
import { LanguagePairPicker } from "@/components/tasks/language-pair-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  defaultSourceLanguage,
  defaultTargetLanguage,
  getLanguageLabel,
  resolveContributionLanguages,
} from "@/lib/languages";
import { getSamplePhrase } from "@/lib/translation-samples";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { recordAndSyncContribution } from "@/lib/record-contribution";
import { toast } from "sonner";

export default function TranslationTaskPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const appLanguage = useAppStore((s) => s.appLanguage);

  const contributionLanguages = useMemo(
    () => resolveContributionLanguages(user?.languages ?? ["fr"]),
    [user?.languages],
  );

  const canTranslate = contributionLanguages.length >= 2;

  const [sourceLang, setSourceLang] = useState(() =>
    defaultSourceLanguage(appLanguage, contributionLanguages),
  );
  const [targetLang, setTargetLang] = useState(() =>
    defaultTargetLanguage(
      defaultSourceLanguage(appLanguage, contributionLanguages),
      contributionLanguages,
    ),
  );
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const source = defaultSourceLanguage(appLanguage, contributionLanguages);
    setSourceLang(source);
    setTargetLang(defaultTargetLanguage(source, contributionLanguages));
  }, [appLanguage, contributionLanguages]);

  const sourcePhrase = getSamplePhrase(sourceLang, index);

  const submit = async () => {
    if (!canTranslate) {
      toast.error("Ajoutez au moins deux langues de contribution dans les paramètres");
      return;
    }
    if (sourceLang === targetLang) {
      toast.error("Choisissez deux langues différentes");
      return;
    }
    if (!text.trim()) {
      toast.error("Entrez une traduction");
      return;
    }

    const phrase = getSamplePhrase(sourceLang, index);
    await recordAndSyncContribution("translation", token, {
      sourceLang,
      targetLang,
      sourceText: phrase,
      translation: text.trim(),
    });

    toast.success(
      `+60 XP · ${getLanguageLabel(sourceLang)} → ${getLanguageLabel(targetLang)}`,
    );
    setText("");
    setIndex((i) => i + 1);
  };

  const nextItem = () => {
    setText("");
    setIndex((i) => i + 1);
  };

  return (
    <TaskShell
      title="Traduction"
      onSkip={canTranslate ? nextItem : undefined}
      onPrevious={
        canTranslate && index > 0 ? () => setIndex((i) => i - 1) : undefined
      }
    >
      {!canTranslate ? (
        <Card className="border-0 bg-muted/50">
          <CardContent className="flex flex-col gap-3 p-5 text-sm">
            <p>
              Pour traduire, sélectionnez au moins <strong>deux langues</strong>{" "}
              de contribution dans votre profil.
            </p>
            <Link
              href="/settings"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-input bg-background px-4 text-sm font-medium hover:bg-muted/50"
            >
              Modifier mes langues
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <LanguagePairPicker
            className="mb-4"
            languages={contributionLanguages}
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
          />

          <Card className="mb-4 border-0 bg-muted/50">
            <CardContent className="p-5">
              <Label className="text-muted-foreground">
                Phrase source ({getLanguageLabel(sourceLang)})
              </Label>
              <p className="mt-2 font-heading text-lg font-semibold">
                {sourcePhrase}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Label htmlFor="translation">
              Votre traduction ({getLanguageLabel(targetLang)})
            </Label>
            <textarea
              id="translation"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Écrivez la traduction en ${getLanguageLabel(targetLang).toLowerCase()}…`}
              className="min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Button className="mt-6 h-12 w-full" size="lg" onClick={() => void submit()}>
            Soumettre
          </Button>
        </>
      )}
    </TaskShell>
  );
}
