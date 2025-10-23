"use client";

import React, { useState } from "react";
import AuthPhoneStep from "./AuthPhoneStep";
import AuthOtpStep from "./AuthOtpStep";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthMobileScreen() {
  const [mode, setMode] = useState<"phone" | "otp" | "register">("phone");
  const [phoneValue, setPhoneValue] = useState<string>("");

  return (
    <div className="min-h-screen bg-white">
      {/* Auth content area */}
      <div className="max-w-md mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {mode === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <AuthPhoneStep
                onNext={(phone) => {
                  setPhoneValue(phone);
                  setMode("otp");
                }}
                onOpenRegister={() => setMode("register")}
              />
            </motion.div>
          )}

          {mode === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <AuthOtpStep
                phone={phoneValue}
                onBack={() => setMode("phone")}
                onVerified={() => {
                  console.log("User verified!");
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
