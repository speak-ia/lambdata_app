"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/app-header";
import { Crown } from "lucide-react";
import type { LeaderboardEntry } from "@/types";

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: "1", displayName: "Fatou N.", country: "SN", points: 1502445 },
  { rank: 2, userId: "2", displayName: "Ibrahim K.", country: "ML", points: 1420100 },
  { rank: 3, userId: "3", displayName: "Awa T.", country: "CI", points: 1380500 },
  { rank: 4, userId: "4", displayName: "Moussa B.", country: "BF", points: 980200 },
  { rank: 5, userId: "5", displayName: "Kadiatou S.", country: "GN", points: 875400 },
];

const FLAGS: Record<string, string> = {
  SN: "🇸🇳",
  ML: "🇲🇱",
  CI: "🇨🇮",
  BF: "🇧🇫",
  GN: "🇬🇳",
};

export default function LeaderboardsPage() {
  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 pb-4"
    >
      <AppHeader showLogo={false} title="Classement" />
      <p className="text-center font-heading text-xl font-semibold text-primary">
        Traduction
      </p>

      <div className="flex items-end justify-center gap-3 px-2">
        {[top3[1], top3[0], top3[2]].map((entry, i) => (
          <div
            key={entry.userId}
            className={`flex flex-col items-center gap-1 ${i === 1 ? "scale-110" : ""}`}
          >
            {i === 1 && <Crown className="size-5 text-gold" />}
            <Avatar className={i === 1 ? "size-16" : "size-12"}>
              <AvatarFallback>{entry.displayName[0]}</AvatarFallback>
            </Avatar>
            <p className="max-w-[80px] truncate text-xs font-medium">
              {entry.displayName}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {entry.points.toLocaleString("fr-FR")} pts
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {rest.map((entry) => (
          <Card key={entry.userId} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-3 p-3">
              <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                {entry.rank}
              </span>
              <Avatar className="size-10">
                <AvatarFallback>{entry.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{entry.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.points.toLocaleString("fr-FR")} points
                </p>
              </div>
              <span className="text-lg">{FLAGS[entry.country] ?? "🌍"}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
