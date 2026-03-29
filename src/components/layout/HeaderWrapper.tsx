"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import Header from "./Header";
import { useCartStore } from "@/lib/cartStore";
import { getTokenPair } from "@/lib/axios/instance";
import { useWishlistStore } from "@/lib/wishlistStore";

export function WishlistCartBootstrap() {
  const fetchCart = useCartStore((s) => s.fetchCart);

  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);

  const isAuthenticated = Boolean(getTokenPair().token);
  const locale = useLocale();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart(locale);
      fetchWishlist(locale);
    }
  }, [fetchCart, fetchWishlist, isAuthenticated, locale]);

  return null;
}

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

  const HIDDEN_PATHS = [`/${locale}/cart`];
  const shouldHide =
    isMobile &&
    (pathname.startsWith(`/${locale}/product/`) ||
      HIDDEN_PATHS.includes(pathname));

  if (shouldHide) return null;

  return <Header />;
}
