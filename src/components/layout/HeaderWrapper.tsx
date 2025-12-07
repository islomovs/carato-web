"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  const locale = useLocale();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const HIDDEN_PATHS = [`/${locale}/product`, `/${locale}/cart`];
  const shouldHide =
    isMobile && HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  if (shouldHide) return null;

  return <Header />;
}
