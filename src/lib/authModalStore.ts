import { create } from "zustand";

type AuthMode = "phone" | "otp";

interface AuthModalState {
  open: boolean;
  mode: AuthMode;
  phone?: string;

  openAuth: (params?: { mode?: AuthMode; phone?: string }) => void;
  closeAuth: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  open: false,
  mode: "phone",
  phone: undefined,

  openAuth: (params) =>
    set({
      open: true,
      mode: params?.mode ?? "phone",
      phone: params?.phone,
    }),

  closeAuth: () =>
    set({
      open: false,
      mode: "phone",
      phone: undefined,
    }),
}));


