"use client";

import { usePathname } from "next/navigation";
import { MobileShell } from "./mobile-shell";

export function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNav =
    pathname.startsWith("/tasks") || pathname === "/profile";

  return <MobileShell hideNav={hideNav}>{children}</MobileShell>;
}
