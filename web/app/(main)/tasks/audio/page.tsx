"use client";

import { useMemo, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { TaskShell } from "@/components/tasks/task-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getAudioPhrasesForLanguages } from "@/lib/audio-phrases";
import { getLanguageLabel, resolveContributionLanguages } from "@/lib/languages";
import { recordAndSyncContribution } from "@/lib/record-contribution";
import { queueUpload } from "@/offline/db";
import { useAuthStore } from "@/store/auth-store";

export default function AudioTaskPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const userLanguages = useMemo(
    () => resolveContributionLanguages(user?.languages ?? ["fr"]),
    [user?.languages],
  );
  const phrases = useMemo(
    () => getAudioPhrasesForLanguages(userLanguages),
    [userLanguages],
  );

  const [index, setIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const current = phrases[index % phrases.length];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const b = new Blob(chunksRef.current, { type: "audio/webm" });
        setBlob(b);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      toast.error("Microphone non disponible");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const submit = async () => {
    if (!blob) {
      toast.error("Enregistrez d'abord votre voix");
      return;
    }

    await queueUpload({
      module: "audio",
      payload: {
        phrase: current.text,
        language: current.lang,
        size: blob.size,
        type: blob.type,
        token: token ?? undefined,
      },
    });

    await recordAndSyncContribution("audio", token, {
      phrase: current.text,
      language: current.lang,
      size: blob.size,
    });

    toast.success(`+75 XP · ${getLanguageLabel(current.lang)}`);
    setBlob(null);
    setIndex((i) => i + 1);
  };

  return (
    <TaskShell
      title="Collecte vocale"
      onSkip={() => setIndex((i) => i + 1)}
      onPrevious={index > 0 ? () => setIndex((i) => i - 1) : undefined}
      className="pattern-waves"
    >
      <p className="mb-2 text-center text-sm text-muted-foreground">
        Lisez le texte à voix haute
      </p>
      <p className="mb-6 text-center text-xs text-primary">
        Langue : {getLanguageLabel(current.lang)}
      </p>

      <Card className="mx-auto w-full max-w-sm border-0 shadow-lg">
        <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-6 p-8">
          <p className="text-center font-heading text-2xl font-bold leading-snug">
            {current.text}
          </p>

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              size="icon"
              className={`size-20 rounded-full ${recording ? "bg-destructive hover:bg-destructive/90" : "bg-primary"}`}
              onClick={recording ? stopRecording : startRecording}
              aria-label={recording ? "Arrêter" : "Enregistrer"}
            >
              {recording ? (
                <Square className="size-8 fill-current" />
              ) : (
                <Mic className="size-8" />
              )}
            </Button>
          </motion.div>

          {blob && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setBlob(null)}>
                Supprimer
              </Button>
              <Button size="sm" onClick={() => void submit()}>
                Envoyer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Label className="mt-4 block text-center text-xs text-muted-foreground">
        Phrase {index + 1} / {phrases.length} · sync hors ligne si besoin
      </Label>
    </TaskShell>
  );
}
