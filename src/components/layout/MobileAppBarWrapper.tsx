"use client";

import { usePathname } from "next/navigation";
import MobileAppBar from "./MobileAppBar";
import { useLocale } from "next-intl";
import { useAuthPageStore } from "@/lib/authPageStore";

export default function MobileAppBarWrapper() {
  const pathname = usePathname();
  const locale = useLocale();
  const authStep = useAuthPageStore((s) => s.step);

  const HIDDEN_PATHS = [
    `/${locale}/checkout`,
    `/${locale}/cart`,
    `/${locale}/product`,
  ];

  const isHiddenPath = HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  // On the auth page, hide the app bar while on the OTP step
  const isAuthOtp =
    pathname.startsWith(`/${locale}/auth`) && authStep === "otp";

  if (isHiddenPath || isAuthOtp) return null;

  return <MobileAppBar />;
}
