"use client";

import { usePathname } from "next/navigation";
import MobileAppBar from "./MobileAppBar";
import { useLocale } from "next-intl";

export default function MobileAppBarWrapper() {
  const pathname = usePathname();
  const locale = useLocale();
  const HIDDEN_PATHS = [
    `/${locale}/checkout`,
    `/${locale}/cart`,
    `/${locale}/product`,
  ];

  const shouldHide = HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  if (shouldHide) return null;

  return <MobileAppBar />;
}
