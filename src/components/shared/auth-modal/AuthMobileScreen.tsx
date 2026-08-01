"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import AuthPhoneStep from "./AuthPhoneStep";
import AuthOtpStep from "./AuthOtpStep";
import { useAuthPageStore } from "@/lib/authPageStore";

export default function AuthMobileScreen() {
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();

  const setStep = useAuthPageStore((s) => s.setStep);
  const reset = useAuthPageStore((s) => s.reset);

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
    router.push(`/${locale}/profile`);
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
