"use client";

import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  phone: string;
  onBack: () => void;
  onVerified: () => void;
};

export default function AuthOtpStep({ phone, onBack, onVerified }: Props) {
  const t = useTranslations("auth");
  const [code, setCode] = useState("");
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
      const res = await verify(phone, code);
      // verify saved tokens in localStorage by hook
      // If server returns user with fullName null -> navigate to registration step
      if (!res.fullName) {
        // open register step (ask fullname), then call completeAuth after register
        onVerified(); // or route to registration
      } else {
        // user is fully authenticated — navigate to app
        onVerified();
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Invalid code or server error");
    }
  };

  const handleResend = async () => {
    try {
      await doResend(phone);
      setTimer(32);
    } catch (err) {
      console.error(err);
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
          <OtpInput
            value={code}
            onChange={(val: string) => {
              setCode(val);
              setError(null);
            }}
            numInputs={6}
            inputType="tel"
            containerStyle={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
            renderInput={(props) => (
              <input
                {...props}
                placeholder="-"
                className={`text-center border rounded-[4px] text-[20px] font-medium focus:outline-none ${
                  error ? "border-red-500" : "border-black"
                }`}
                style={{
                  width: "60px",
                  height: "60px",
                }}
              />
            )}
          />
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
