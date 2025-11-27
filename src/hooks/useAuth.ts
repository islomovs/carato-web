// src/hooks/useAuth.ts
import { useCallback } from "react";
import { sendCode, verifyCode, resendCode } from "@/services/auth.api";
import { setTokenPair, clearTokenPair } from "@/lib/axios/instance";

export function useAuth() {
  const startSendCode = useCallback(async (phone: string) => {
    return sendCode(phone);
  }, []);

  const verify = useCallback(async (phone: string, code: string) => {
    const data = await verifyCode(phone, code);
    // save tokens
    setTokenPair({ token: data.token, refreshToken: data.refreshToken });
    return data;
  }, []);

  const doResend = useCallback(async (phone: string) => {
    return resendCode(phone);
  }, []);

  const logout = useCallback(() => {
    clearTokenPair();
  }, []);

  return { startSendCode, verify, doResend, logout };
}
