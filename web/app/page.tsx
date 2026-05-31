"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LambdataLogo } from "@/components/branding/lambdata-logo";
import { useAuthStore } from "@/store/auth-store";
import { getPostAuthPath } from "@/lib/user-profile";
import { motion } from "framer-motion";

export default function SplashPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const t = setTimeout(() => {
      if (user) {
        router.replace(getPostAuthPath(user));
      } else {
        router.replace("/login");
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [user, router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-black pattern-data px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LambdataLogo size="splash" priority />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-cyan-400/80"
      >
        Données IA souveraines pour l&apos;Afrique
      </motion.p>
    </div>
  );
}
