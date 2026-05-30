"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

export function StatsRow() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="border-0 bg-card shadow-sm">
        <CardContent className="flex flex-col gap-1 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Validations
          </p>
          <p className="font-heading text-2xl font-bold text-primary">
            {(user?.agreements ?? 0).toLocaleString("fr-FR")}
          </p>
        </CardContent>
      </Card>
      <Card className="border-0 bg-card shadow-sm">
        <CardContent className="flex flex-col gap-1 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Contributions
          </p>
          <p className="font-heading text-2xl font-bold text-sand-foreground">
            {(user?.contributions ?? 0).toLocaleString("fr-FR")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
