"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import CheckoutLayer from "@/components/layout/CheckoutLayer";
import { useAuthStatus } from "@/lib/authStore";

export default function CheckoutPage() {
  const router = useRouter();
  const locale = useLocale();
  const { ready, isAuthenticated } = useAuthStatus();

  // Checkout requires login
  useEffect(() => {
    if (ready && !isAuthenticated) {
      const returnTo = encodeURIComponent(`/${locale}/cart`);
      router.replace(`/${locale}/auth?returnTo=${returnTo}&guard=1`);
    }
  }, [ready, isAuthenticated, router, locale]);

  if (!ready || !isAuthenticated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <CheckoutLayer open={true} fullPage />
    </motion.div>
  );
}
