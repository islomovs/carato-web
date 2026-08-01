import { create } from "zustand";

interface AuthPageState {
  step: "phone" | "otp";
  setStep: (step: "phone" | "otp") => void;
  reset: () => void;
}

export const useAuthPageStore = create<AuthPageState>((set) => ({
  step: "phone",
  setStep: (step) => set({ step }),
  reset: () => set({ step: "phone" }),
}));
