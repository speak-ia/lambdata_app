"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useTheme } from "@/hooks/use-theme";
import { PwaRegister } from "@/pwa/register";

function AppEffects() {
  useOnlineStatus();
  useTheme();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppEffects />
      <PwaRegister />
      {children}
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}
