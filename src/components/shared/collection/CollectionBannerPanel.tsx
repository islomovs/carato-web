"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { CollectionBanner } from "@/services/collections";
import ProductCard from "@/components/shared/product/ProductCard";
import useLockScroll from "@/hooks/useLockScroll";

interface CollectionBannerPanelProps {
  banner: CollectionBanner | null;
  onClose: () => void;
}

export default function CollectionBannerPanel({
  banner,
  onClose,
}: CollectionBannerPanelProps) {
  const open = banner !== null;
  useLockScroll(open);

  const t = useTranslations("collection");

  const scrollRef = useRef<HTMLDivElement>(null);
  const [headerBorder, setHeaderBorder] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setHeaderBorder(el.scrollTop > 0);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [open]);

  // Reset scroll when reopened
  useEffect(() => {
    if (open) {
      scrollRef.current?.scrollTo(0, 0);
      setHeaderBorder(false);
    }
  }, [open, banner]);

  return (
    <AnimatePresence>
      {open && banner && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-[#00000040] z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* ── Mobile: full-screen slide-up layer ─────────────── */}
          <motion.div
            key="mobile-panel"
            className="md:hidden fixed inset-0 bg-white z-[100] flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Sticky header — title centered, 300 / 14px / 20px */}
            <div
              className="flex-shrink-0 relative flex items-center justify-center bg-white transition-all"
              style={{
                height: 56,
                borderBottom: headerBorder
                  ? "1px solid #EEF2F6"
                  : "1px solid transparent",
              }}
            >
              <span
                style={{
                  fontWeight: 300,
                  fontSize: 14,
                  lineHeight: "20px",
                }}
              >
                {t("featuredProducts")}
              </span>
              <button
                onClick={onClose}
                className="absolute right-4 flex items-center justify-center w-9 h-9"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable product grid — 2 columns */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-8">
              <div className="grid grid-cols-2 gap-3 pt-4">
                {banner.products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product as never}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Desktop: right-side drawer ─────────────────────── */}
          <motion.div
            key="desktop-panel"
            className="hidden md:flex fixed top-4 right-4 bottom-4 bg-white z-[100] flex-col rounded-lg overflow-hidden"
            style={{ width: 480 }}
            initial={{ x: "calc(100% + 16px)" }}
            animate={{ x: 0 }}
            exit={{ x: "calc(100% + 16px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Sticky header */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-6 bg-white transition-all"
              style={{
                height: 72,
                borderBottom: headerBorder
                  ? "1px solid #EEF2F6"
                  : "1px solid transparent",
              }}
            >
              <span
                style={{ fontWeight: 400, fontSize: 18, lineHeight: "26px" }}
              >
                {t("featuredProducts")}
              </span>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable product grid — 2 columns */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid grid-cols-2 gap-4 pt-5">
                {banner.products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product as never}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
