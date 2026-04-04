"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Seller } from "@/services/product";
import SellerInfoCard from "./SellerInfoCard";
import SellerDetailDialog from "./SellerDetailDialog";
import SellerCatalog from "./SellerCatalog";
import useLockScroll from "@/hooks/useLockScroll";

const formatSellerDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `с ${date
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(" г.", " года")}`;
};

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

  useLockScroll(detailOpen);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: seller.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const stats = [
    {
      icon: "/icons/calendar.svg",
      label: t("withUs"),
      value: seller.createdTime ? formatSellerDate(seller.createdTime) : "—",
    },
    {
      icon: "/icons/receipt.svg",
      label: t("totalOrders"),
      value: seller.ordersQuantity?.toLocaleString() ?? "—",
    },
    {
      icon: "/icons/star.svg",
      label: t("averageRating"),
      value: seller.averageReviewRating?.toFixed(1) ?? "—",
    },
    {
      icon: "/icons/announcement.svg",
      label: t("reviewsCount"),
      value: seller.reviewsQuantity?.toLocaleString() ?? "—",
    },
  ];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-white z-[70] flex flex-col"
          >
            {/* Main header */}
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

            {/* ── Detail sub-layer — slides in on top ── */}
            <AnimatePresence>
              {detailOpen && (
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 bg-white flex flex-col z-[80]"
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-end border-b border-[#EEF2F6] flex-shrink-0"
                    style={{ height: 64, paddingRight: 8 }}
                  >
                    <button
                      onClick={() => setDetailOpen(false)}
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

                  {/* Content */}
                  <div
                    className="flex-1 overflow-y-auto px-4"
                    style={{ paddingTop: 32 }}
                  >
                    <p
                      style={{
                        fontWeight: 400,
                        fontSize: 24,
                        lineHeight: "34px",
                      }}
                    >
                      {t("aboutSeller")}
                    </p>

                    <div style={{ marginTop: 32 }}>
                      {stats.map((stat, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                          style={{ height: 64 }}
                        >
                          {/* Left: icon + label */}
                          <div
                            className="flex items-center"
                            style={{ gap: 16 }}
                          >
                            <div
                              className="flex items-center justify-center rounded-[4px] flex-shrink-0"
                              style={{
                                width: 40,
                                height: 40,
                                background: "#EEF2F6",
                              }}
                            >
                              <Image
                                src={stat.icon}
                                alt={stat.label}
                                width={20}
                                height={20}
                              />
                            </div>
                            <span
                              style={{
                                fontWeight: 300,
                                fontSize: 18,
                                lineHeight: "26px",
                              }}
                            >
                              {stat.label}
                            </span>
                          </div>

                          {/* Right: value badge */}
                          <div
                            className="flex items-center justify-center rounded-[4px] px-3 flex-shrink-0"
                            style={{
                              background: "#EEF2F6",
                              minWidth: 48,
                              height: 32,
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 500,
                                fontSize: 12,
                                lineHeight: "18px",
                              }}
                            >
                              {stat.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop dialog — kept for /seller/[slug] page */}
      <SellerDetailDialog
        seller={seller}
        open={false}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
