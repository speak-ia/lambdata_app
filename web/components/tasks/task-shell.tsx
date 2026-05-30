"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FolderOpen, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskShellProps {
  title: string;
  children: React.ReactNode;
  onSkip?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export function TaskShell({
  title,
  children,
  onSkip,
  onPrevious,
  className,
}: TaskShellProps) {
  const router = useRouter();

  return (
    <div className={cn("flex min-h-dvh flex-col", className)}>
      <header className="flex items-center justify-between px-2 py-3 safe-top">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Retour"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="font-heading text-base font-semibold">{title}</h1>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" aria-label="Dossier">
            <FolderOpen className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Menu">
            <MoreVertical className="size-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col px-4">{children}</div>

      <footer className="flex items-center justify-between px-6 py-4 safe-bottom">
        <button
          type="button"
          onClick={onPrevious}
          className="text-sm font-medium text-primary disabled:opacity-40"
          disabled={!onPrevious}
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-primary"
        >
          Passer &gt;
        </button>
      </footer>
    </div>
  );
}
