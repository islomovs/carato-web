"use client";

import AuthModal from "./index";
import { useAuthModalStore } from "@/lib/authModalStore";

// Only renders the desktop modal — mobile auth uses the /auth page route.
export default function GlobalAuthModal() {
  const { mode, phone } = useAuthModalStore();
  return <AuthModal initialMode={mode} initialPhone={phone} />;
}
