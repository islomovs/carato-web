import api from "@/lib/axios/instance";

export type VerifyCodeRes = {
  id: number;
  phone: string;
  fullName: string | null;
  role: string;
  token: string;
  refreshToken: string;
};

export async function sendCode(phone: string) {
  const payload = { phone };
  const res = await api.post("/api/v1/auth/sendCode", payload);
  // response example: { isAlreadyExist: false }
  return res.data;
}

export async function verifyCode(
  phone: string,
  code: string
): Promise<VerifyCodeRes> {
  const res = await api.post("/api/v1/auth/verifyCode", { phone, code });
  return res.data;
}

export async function resendCode(phone: string) {
  const res = await api.post("/api/v1/auth/resendCode", { phone });
  return res.data;
}

export async function refreshToken(refreshToken: string) {
  const res = await api.post("/api/v1/auth/refresh", { refreshToken });
  return res.data as VerifyCodeRes;
}
