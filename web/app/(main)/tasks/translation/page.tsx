"use client";

import { useState } from "react";
import { TaskShell } from "@/components/tasks/task-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SOURCE = [
  { fr: "Bonjour, comment allez-vous ?", target: "wo" },
  { fr: "Le riz est prêt.", target: "bm" },
];

export default function TranslationTaskPage() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const item = SOURCE[index % SOURCE.length];

  const submit = () => {
    if (!text.trim()) {
      toast.error("Entrez une traduction");
      return;
    }
    toast.success("Traduction enregistrée");
    setText("");
    setIndex((i) => i + 1);
  };

  return (
    <TaskShell
      title="Traduction"
      onSkip={() => {
        setText("");
        setIndex((i) => i + 1);
      }}
      onPrevious={index > 0 ? () => setIndex((i) => i - 1) : undefined}
    >
      <Card className="mb-4 border-0 bg-muted/50">
        <CardContent className="p-5">
          <Label className="text-muted-foreground">Phrase source (FR)</Label>
          <p className="mt-2 font-heading text-lg font-semibold">{item.fr}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <Label htmlFor="translation">Votre traduction</Label>
        <textarea
          id="translation"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrivez la traduction ici…"
          className="min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button className="mt-6 h-12 w-full" size="lg" onClick={submit}>
        Soumettre
      </Button>
    </TaskShell>
  );
}
