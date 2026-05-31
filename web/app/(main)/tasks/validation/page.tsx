"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TaskShell } from "@/components/tasks/task-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  availableQuestionLanguages,
  filterValidationTasksForUser,
  getTaskQuestion,
  pickQuestionLanguage,
  type CulturalValidationTask,
} from "@/lib/validation-tasks";
import {
  getLanguageLabel,
  resolveContributionLanguages,
} from "@/lib/languages";
import { recordAndSyncContribution } from "@/lib/record-contribution";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export default function ValidationTaskPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const appLanguage = useAppStore((s) => s.appLanguage);

  const userLanguages = useMemo(
    () => resolveContributionLanguages(user?.languages ?? ["fr"]),
    [user?.languages],
  );

  const tasks = useMemo(
    () => filterValidationTasksForUser(userLanguages),
    [userLanguages],
  );

  const [index, setIndex] = useState(0);
  const task = tasks[index % Math.max(tasks.length, 1)] as
    | CulturalValidationTask
    | undefined;

  const defaultLang = task
    ? pickQuestionLanguage(task, appLanguage, userLanguages)
    : null;

  const [questionLang, setQuestionLang] = useState<string | null>(defaultLang);

  const langOptions = task
    ? availableQuestionLanguages(task, userLanguages)
    : [];

  const activeLang =
    questionLang && langOptions.includes(questionLang)
      ? questionLang
      : defaultLang;

  useEffect(() => {
    if (!task) return;
    setQuestionLang(pickQuestionLanguage(task, appLanguage, userLanguages));
  }, [task?.id, appLanguage, userLanguages, task]);

  const vote = async (answer: boolean) => {
    if (!task) return;
    const lang =
      activeLang ?? pickQuestionLanguage(task, appLanguage, userLanguages);
    if (!lang) return;

    await recordAndSyncContribution("validation", token, {
      taskId: task.id,
      answer,
      questionLanguage: lang,
      imageUrl: task.imageUrl,
    });

    toast.success(answer ? "+25 XP · Oui" : "+25 XP · Non");
    setIndex((i) => i + 1);
    setQuestionLang(null);
  };

  const goToTask = (newIndex: number) => {
    setIndex(newIndex);
    setQuestionLang(null);
  };

  if (userLanguages.length === 0) {
    return (
      <TaskShell title="Validation culturelle">
        <p className="text-center text-sm text-muted-foreground">
          Ajoutez vos langues de contribution dans les paramètres.
        </p>
        <Link
          href="/settings"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl border border-input text-sm font-medium"
        >
          Paramètres
        </Link>
      </TaskShell>
    );
  }

  if (tasks.length === 0) {
    return (
      <TaskShell title="Validation culturelle">
        <p className="text-center text-sm text-muted-foreground">
          Aucune validation disponible pour vos langues (
          {userLanguages.map(getLanguageLabel).join(", ")}). Modifiez vos langues
          ou revenez plus tard.
        </p>
        <Link
          href="/settings"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl border border-input text-sm font-medium"
        >
          Modifier mes langues
        </Link>
      </TaskShell>
    );
  }

  const resolvedLang =
    activeLang ?? pickQuestionLanguage(task!, appLanguage, userLanguages);

  if (!resolvedLang) return null;

  const displayQuestion = getTaskQuestion(task!, resolvedLang);

  return (
    <TaskShell
      title="Validation culturelle"
      onSkip={() => goToTask(index + 1)}
      onPrevious={index > 0 ? () => goToTask(index - 1) : undefined}
    >
      <p className="mb-2 text-center text-sm text-muted-foreground">
        Validation d&apos;images culturelles
      </p>

      {langOptions.length > 1 && (
        <div className="mb-4 flex flex-col gap-1.5">
          <Label htmlFor="q-lang" className="text-xs text-muted-foreground">
            Langue de la question
          </Label>
          <select
            id="q-lang"
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-base"
            value={resolvedLang}
            onChange={(e) => setQuestionLang(e.target.value)}
          >
            {langOptions.map((code) => (
              <option key={code} value={code}>
                {getLanguageLabel(code)}
              </option>
            ))}
          </select>
        </div>
      )}

      <p className="mb-1 text-center text-xs text-primary/90">
        Question en {getLanguageLabel(resolvedLang)}
      </p>
      <h2 className="mb-6 text-center font-heading text-xl font-semibold leading-snug">
        {displayQuestion}
      </h2>

      <motion.div
        key={`${task!.id}-${index}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-muted"
      >
        <Image
          src={task!.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 400px) 100vw"
          unoptimized
        />
      </motion.div>

      <div className="mt-auto flex gap-3 py-8">
        <Button
          variant="outline"
          size="lg"
          className="h-14 flex-1 text-lg font-semibold"
          onClick={() => void vote(false)}
        >
          Non
        </Button>
        <Button
          size="lg"
          className="h-14 flex-1 text-lg font-semibold"
          onClick={() => void vote(true)}
        >
          Oui
        </Button>
      </div>
    </TaskShell>
  );
}
