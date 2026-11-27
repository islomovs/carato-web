"use client";

import { usePathname } from "next/navigation";
import MobileAppBar from "./MobileAppBar";
import { useLocale } from "next-intl";
import { useAuthPageStore } from "@/lib/authPageStore";

/** Whether the mobile bottom app bar is shown on the current page (shared with the mobile menu). */
export function useMobileAppBarVisible() {
  const pathname = usePathname();
  const locale = useLocale();
  const authStep = useAuthPageStore((s) => s.step);

  // Exact segment match — `/product` must not also hide the bar on `/products` (category listings)
  const HIDDEN_PATHS = [
    `/${locale}/checkout`,
    `/${locale}/cart`,
    `/${locale}/product`,
  ];
  const isHiddenPath = HIDDEN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // On the auth page, hide the app bar while on the OTP step
  const isAuthOtp =
    pathname.startsWith(`/${locale}/auth`) && authStep === "otp";

  return !isHiddenPath && !isAuthOtp;
}

export default function MobileAppBarWrapper() {
  const visible = useMobileAppBarVisible();
  if (!visible) return null;
  return <MobileAppBar />;
}
