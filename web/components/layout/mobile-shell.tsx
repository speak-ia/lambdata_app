import { cn } from "@/lib/utils";
import { BottomNav } from "./bottom-nav";
import { OfflineBanner } from "./offline-banner";

interface MobileShellProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
}

export function MobileShell({
  children,
  className,
  hideNav = false,
}: MobileShellProps) {
  return (
    <div className="relative min-h-dvh bg-background pattern-waves">
      <OfflineBanner />
      <main
        className={cn(
          "mx-auto min-h-dvh w-full max-w-lg px-4 safe-top",
          !hideNav && "pb-24",
          className,
        )}
      >
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
