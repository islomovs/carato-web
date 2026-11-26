/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const OTP_LENGTH = 6;

type Props = {
  phone: string;
  onBack: () => void;
  onVerified: () => void;
  initialPhone?: string;
};

export default function AuthOtpStep({
  phone,
  onBack,
  onVerified,
  initialPhone,
}: Props) {
  const t = useTranslations("auth");
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(32);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timer <= 0) {
      setResendDisabled(false);
      return;
    }
    setResendDisabled(true);
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const { verify, doResend } = useAuth();

  const handleSubmit = async () => {
    try {
      const res = await verify(initialPhone || phone, code);

      toast.success(t("loggedIn"));
      onVerified();
    } catch (err) {
      setError(t("errors.codeInvalid"));
      toast.error(t("errors.codeInvalid"));
    }
  };

  // Android Chrome: read the code straight from the SMS (WebOTP, user taps "Allow").
  // Only works when the SMS ends with a line like "@carato.uz #123456".
  useEffect(() => {
    if (typeof window === "undefined" || !("OTPCredential" in window)) return;
    const ac = new AbortController();
    navigator.credentials
      .get({ otp: { transport: ["sms"] }, signal: ac.signal } as CredentialRequestOptions)
      .then((cred) => {
        const otp = (cred as (Credential & { code?: string }) | null)?.code;
        if (otp) {
          setCode(otp.replace(/\D/g, "").slice(0, OTP_LENGTH));
          setError(null);
        }
      })
      .catch(() => {
        // aborted (step left) or not supported — manual entry still works
      });
    return () => ac.abort();
  }, []);

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (code.length === OTP_LENGTH) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleResend = async () => {
    try {
      await doResend(initialPhone || phone);
      setTimer(32);
      toast.success(t("resendCodeSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("errors.resendFailed"));
    }
  };

  return (
    <div>
      <h3 className="text-[24px] font-normal text-black mb-2">
        {t("titleOtp")}
      </h3>
      <p className="text-[18px] font-light mb-10">
        {t("subtitleOtp", { phone })}
      </p>

      {/* ✅ OTP Input */}
      <div className="mb-10 flex flex-col items-start">
        <div className="flex justify-center w-full mb-2">
          {/*
            One real input with autocomplete="one-time-code" laid invisibly over 6 display boxes.
            iOS only offers the SMS code (QuickType bar) on the focused field when it carries
            one-time-code, and splits/drops it across multi-input OTP widgets — a single field is reliable.
          */}
          <div
            className="relative w-full flex justify-between"
            onClick={() => inputRef.current?.focus()}
          >
            {Array.from({ length: OTP_LENGTH }).map((_, i) => {
              const active = focused && i === Math.min(code.length, OTP_LENGTH - 1);
              return (
                <div
                  key={i}
                  className={`flex items-center justify-center border rounded-[4px] text-[20px] font-medium ${
                    error ? "border-red-500" : "border-black"
                  } ${active ? "ring-1 ring-black" : ""}`}
                  style={{ width: "60px", height: "60px" }}
                >
                  {code[i] ?? <span className="text-[#9AA4B2]">-</span>}
                </div>
              );
            })}
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              name="otp"
              autoFocus
              maxLength={OTP_LENGTH}
              value={code}
              aria-label={t("titleOtp")}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH));
                setError(null);
              }}
              onFocus={(e) => {
                setFocused(true);
                // keep the caret at the end — digits are always appended/removed from the end
                const len = e.target.value.length;
                requestAnimationFrame(() => e.target.setSelectionRange(len, len));
              }}
              onBlur={() => setFocused(false)}
              // 16px font stops iOS from zooming on focus; text/caret hidden, boxes show the digits
              className="absolute inset-0 w-full h-full opacity-[0.01] text-[16px] bg-transparent text-transparent caret-transparent outline-none"
            />
          </div>
        </div>

        {/* ✅ Error text */}
        {error && (
          <p className="text-[12px] font-normal text-red-600 text-center">
            {error}
          </p>
        )}
      </div>

      {/* ✅ Resend button */}
      <div className="text-center text-[14px] font-normal mb-10">
        <Button
          variant="link"
          disabled={resendDisabled}
          onClick={handleResend}
          className="text-[14px] font-normal uppercase cursor-pointer"
        >
          {resendDisabled
            ? t("resendCodeAfter", { seconds: timer })
            : t("resendCode")}
        </Button>
      </div>

      {/* ✅ Action buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="default"
          className="w-full bg-black text-white rounded-[4px] py-6 text-[14px] font-normal uppercase cursor-pointer"
          onClick={handleSubmit}
        >
          {t("buttonLogin")}
        </Button>

        <Button
          variant="outline"
          className="w-full bg-white border border-black rounded-[4px] py-6 text-[14px] font-normal uppercase cursor-pointer"
          onClick={onBack}
        >
          {t("back")}
        </Button>
      </div>
    </div>
  );
}
