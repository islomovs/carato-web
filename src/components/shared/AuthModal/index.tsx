"use client";
import React, { useState } from "react";
import AuthPhoneStep from "./AuthPhoneStep";
import AuthOtpStep from "./AuthOtpStep";
import AuthRegisterStep from "./AuthRegisterStep";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
};

export default function AuthModal({
  open,
  onClose,
  initialMode = "login",
}: Props) {
  const [mode, setMode] = useState<"phone" | "otp" | "register">(
    initialMode === "register" ? "register" : "phone"
  );
  const [phoneValue, setPhoneValue] = useState<string>("");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Modal container */}
          <motion.div
            className="relative bg-white rounded-[8px] w-full max-w-[520px] z-10 overflow-hidden"
            style={{ padding: 40 }}
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-[20px] h-[20px] flex items-center justify-center cursor-pointer"
              onClick={onClose}
              aria-label="close"
            >
              <Image
                src="/icons/x-close.svg"
                alt="close"
                width={20}
                height={20}
              />
            </button>

            {/* Content switch with transition */}
            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait">
                {mode === "phone" && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
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
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AuthOtpStep
                      phone={phoneValue}
                      onVerified={() => onClose()}
                      onBack={() => setMode("phone")}
                    />
                  </motion.div>
                )}

                {mode === "register" && (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AuthRegisterStep
                      onRegistered={() => onClose()}
                      onBack={() => setMode("phone")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
