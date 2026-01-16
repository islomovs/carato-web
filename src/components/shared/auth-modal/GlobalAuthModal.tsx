"use client";

import AuthModal from "./index";
import { useAuthModalStore } from "@/lib/authModalStore";

export default function GlobalAuthModal() {
  const { mode, phone } = useAuthModalStore();

  return <AuthModal initialMode={mode} initialPhone={phone} />;
}
