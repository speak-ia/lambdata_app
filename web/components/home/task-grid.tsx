"use client";

import Link from "next/link";
import {
  Mic,
  Languages,
  Camera,
  Video,
  CheckCircle2,
  FileText,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TASK_MODULES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Mic,
  Languages,
  Camera,
  Video,
  CheckCircle2,
  FileText,
};

export function TaskGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TASK_MODULES.map((task, i) => {
        const Icon = iconMap[task.icon] ?? Mic;
        const content = (
          <Card
            className={cn(
              "relative flex min-h-[120px] flex-col gap-2 overflow-hidden border-0 p-4 shadow-sm transition active:scale-[0.98]",
              `bg-gradient-to-br ${task.color}`,
              !task.available && "opacity-60",
            )}
          >
            <Icon className="size-8 text-primary" strokeWidth={1.75} />
            <div className="flex flex-1 flex-col justify-end gap-1">
              <h3 className="font-heading text-sm font-semibold leading-tight">
                {task.title}
              </h3>
              {!task.available && (
                <Badge variant="secondary" className="w-fit text-[10px]">
                  Bientôt
                </Badge>
              )}
            </div>
            {!task.available && (
              <Lock className="absolute right-3 top-3 size-4 text-muted-foreground" />
            )}
          </Card>
        );

        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {task.available ? (
              <Link href={task.href} className="block">
                {content}
              </Link>
            ) : (
              <div className="cursor-not-allowed">{content}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
