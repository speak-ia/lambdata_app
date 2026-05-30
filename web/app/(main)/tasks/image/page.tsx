"use client";

import { Camera, ImageIcon } from "lucide-react";
import { TaskShell } from "@/components/tasks/task-shell";

export default function ImageTaskPage() {
  return (
    <TaskShell title="Images culturelles">
      <p className="mb-6 text-center text-muted-foreground">
        Capturez ou sélectionnez des images pour enrichir les datasets locaux
      </p>

      <div className="grid grid-cols-3 gap-2">
        <label className="col-span-1 flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground">
          <Camera className="size-8" />
          <span className="text-sm font-semibold">Caméra</span>
          <input type="file" accept="image/*" capture="environment" className="sr-only" />
        </label>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-xl bg-muted"
          >
            <ImageIcon className="size-8 text-muted-foreground/50" />
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Catégories : nourriture, agriculture, artisanat, marchés…
      </p>
    </TaskShell>
  );
}
