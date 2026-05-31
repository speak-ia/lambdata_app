"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileSetupForm } from "@/components/profile/profile-setup-form";
import { needsProfileSetup } from "@/lib/user-profile";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace("/register");
      return;
    }
    if (!needsProfileSetup(user)) {
      router.replace("/home");
    }
  }, [user, isAuthenticated, router]);

  if (!user || !needsProfileSetup(user)) {
    return null;
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center px-6 py-12">
      <ProfileSetupForm variant="onboarding" />
    </div>
  );
}
