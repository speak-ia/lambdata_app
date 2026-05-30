"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TaskShell } from "@/components/tasks/task-shell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TASKS = [
  {
    question: "Ce plat s'appelle-t-il « thiéboudienne » ?",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  },
  {
    question: "Cet objet est-il un djembé ?",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
  },
];

export default function ValidationTaskPage() {
  const [index, setIndex] = useState(0);
  const task = TASKS[index % TASKS.length];

  const vote = (answer: boolean) => {
    toast.success(answer ? "Oui enregistré" : "Non enregistré");
    setIndex((i) => i + 1);
  };

  return (
    <TaskShell
      title="Validation culturelle"
      onSkip={() => setIndex((i) => i + 1)}
      onPrevious={index > 0 ? () => setIndex((i) => i - 1) : undefined}
    >
      <p className="mb-2 text-center text-sm text-muted-foreground">
        Validation d&apos;images culturelles
      </p>
      <h2 className="mb-6 text-center font-heading text-xl font-semibold leading-snug">
        {task.question}
      </h2>

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mx-auto aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-muted"
      >
        <Image
          src={task.image}
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
          onClick={() => vote(false)}
        >
          Non
        </Button>
        <Button
          size="lg"
          className="h-14 flex-1 text-lg font-semibold"
          onClick={() => vote(true)}
        >
          Oui
        </Button>
      </div>
    </TaskShell>
  );
}
