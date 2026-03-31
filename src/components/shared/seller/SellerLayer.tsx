"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Seller } from "@/services/product";
import useLockScroll from "@/hooks/useLockScroll";
import SellerInfoCard from "./SellerInfoCard";
import SellerDetailDialog from "./SellerDetailDialog";
import SellerCatalog from "./SellerCatalog";

interface SellerLayerProps {
  seller: Seller;
  open: boolean;
  onClose: () => void;
}

export default function SellerLayer({
  seller,
  open,
  onClose,
}: SellerLayerProps) {
  const t = useTranslations("seller");
  const [detailOpen, setDetailOpen] = useState(false);

  useLockScroll(open);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: seller.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* ── MOBILE: full-screen slide-in layer ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-[70] flex flex-col overflow-hidden md:hidden"
          >
            {/* Header */}
            <div
              className="flex items-center border-b border-[#EEF2F6] flex-shrink-0 relative"
              style={{ height: 64 }}
            >
              <button
                onClick={onClose}
                className="absolute flex items-center justify-center"
                style={{ left: 8, width: 36, height: 36 }}
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </button>

              <div className="flex-1 flex items-center justify-center">
                <span
                  className="uppercase"
                  style={{ fontWeight: 300, fontSize: 14, lineHeight: "20px" }}
                >
                  {t("shopTitle")}
                </span>
              </div>

              <div
                className="absolute flex items-center gap-1"
                style={{ right: 8 }}
              >
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center"
                  style={{ width: 36, height: 36 }}
                >
                  <Image
                    src="/icons/share.svg"
                    alt="share"
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center"
                  style={{ width: 36, height: 36 }}
                >
                  <Image
                    src="/icons/x-close.svg"
                    alt="close"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              <SellerInfoCard
                seller={seller}
                onDetailOpen={() => setDetailOpen(true)}
                onShare={handleShare}
                variant="mobile"
              />
              <div style={{ marginTop: 24 }}>
                <SellerCatalog sellerSlug={seller.slug} active={open} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DESKTOP: inline section below main header ── */}
      {open && (
        <div className="hidden md:block w-full">
          <div
            className="mx-8 mt-8 rounded-[4px] overflow-hidden"
            style={{ background: "#F8FAFC" }}
          >
            <SellerInfoCard
              seller={seller}
              onDetailOpen={() => setDetailOpen(true)}
              onShare={handleShare}
              variant="desktop"
            />
          </div>
          <div style={{ marginTop: 24 }}>
            <SellerCatalog sellerSlug={seller.slug} active={open} />
          </div>
        </div>
      )}

      {/* ── Detail dialog ── */}
      <SellerDetailDialog
        seller={seller}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
