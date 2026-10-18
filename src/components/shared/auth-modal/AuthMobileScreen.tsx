"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import AuthPhoneStep from "./AuthPhoneStep";
import AuthOtpStep from "./AuthOtpStep";
import { useAuthPageStore } from "@/lib/authPageStore";
import { getTokenPair } from "@/lib/axios/instance";

export default function AuthMobileScreen() {
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();

  const setStep = useAuthPageStore((s) => s.setStep);
  const reset = useAuthPageStore((s) => s.reset);

  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get("returnTo");
  // Only allow in-app paths (blocks "//evil.com" / "https://..." redirects)
  const returnTo =
    rawReturnTo && rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//")
      ? rawReturnTo
      : null;

  // Already logged in (e.g. reached via browser back/forward) → leave the
  // auth screen without adding a history entry.
  useEffect(() => {
    if (getTokenPair().token) {
      router.replace(returnTo ?? `/${locale}/profile`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [mode, setMode] = useState<"phone" | "otp">("phone");
  const [phoneValue, setPhoneValue] = useState("");

  const goToPhone = () => {
    setMode("phone");
    setStep("phone");
  };

  const goToOtp = (phone: string) => {
    setPhoneValue(phone);
    setMode("otp");
    setStep("otp");
  };

  const onVerified = () => {
    reset();
    const cameFromGuard = searchParams.get("guard") === "1";
    if (returnTo && !cameFromGuard && window.history.length > 1) {
      // We came here from returnTo (e.g. product page → auth). Step back so
      // the auth screen is not left behind in history: product → auth → back
      // gives [..., product], and the page's own back button then works.
      router.back();
    } else {
      // Opened directly (no previous page) → swap auth for the target page.
      router.replace(returnTo ?? `/${locale}/profile`);
    }
  };

  return (
    /* pt-[65px] pushes content below the fixed header on mobile */
    <div className="min-h-screen bg-white pt-[65px] px-4">
      <AnimatePresence mode="wait">
        {mode === "phone" && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
            className="pt-8"
          >
            {/* Title — 32 px below header */}
            <h2 className="font-normal text-[24px] leading-[34px] text-black mb-8">
              {t("titleLogin")}
            </h2>

            <AuthPhoneStep hideTitle compact onNext={goToOtp} />
          </motion.div>
        )}

        {mode === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.22 }}
            className="pt-8"
          >
            <AuthOtpStep
              phone={phoneValue}
              onBack={goToPhone}
              onVerified={onVerified}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
