"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Seller } from "@/services/product";
import { useTranslations } from "next-intl";

interface SellerInfoCardProps {
  seller: Seller;
  onDetailOpen: () => void;
  onShare?: () => void;
  variant?: "mobile" | "desktop";
}

export default function SellerInfoCard({
  seller,
  onDetailOpen,
  onShare,
  variant = "mobile",
}: SellerInfoCardProps) {
  const t = useTranslations("seller");

  const StarRow = () => (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={20}
            className={
              i < Math.round(seller.averageReviewRating ?? 0)
                ? "fill-[#FAC515] text-[#FAC515]"
                : "text-[#FAC515]"
            }
            strokeWidth={
              i < Math.round(seller.averageReviewRating ?? 0) ? 0 : 1.5
            }
          />
        ))}
      </div>
      <span
        style={{ fontWeight: 300, fontSize: 14, lineHeight: "20px", color: "#4B5565" }}
      >
        {t("reviews", { count: seller.reviewsQuantity ?? 0 })}
      </span>
    </div>
  );

  if (variant === "desktop") {
    return (
      <div
        className="w-full rounded-[4px] flex items-center justify-between"
        style={{ background: "#F8FAFC", padding: 24, marginTop: 32, marginLeft: 32, marginRight: 32, marginBottom: 0, width: "calc(100% - 64px)" }}
      >
        {/* Left: avatar + name + stars */}
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 rounded-[4px] overflow-hidden"
            style={{ width: 56, height: 56 }}
          >
            <Image
              src={seller.image || "/images/product-placeholder.png"}
              alt={seller.name}
              width={56}
              height={56}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-[2px]">
            <span style={{ fontWeight: 400, fontSize: 24, lineHeight: "34px" }}>
              {seller.name}
            </span>
            <StarRow />
          </div>
        </div>

        {/* Right: info + share buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Share button */}
          <button
            onClick={onShare}
            className="flex items-center gap-3 rounded-[4px] cursor-pointer px-4"
            style={{ background: "#EEF2F6", height: 52 }}
          >
            <Image src="/icons/share.svg" alt="share" width={20} height={20} />
            <span style={{ fontWeight: 400, fontSize: 14, lineHeight: "20px" }}>
              {t("share")}
            </span>
          </button>

          {/* Info button */}
          <button
            onClick={onDetailOpen}
            className="flex items-center justify-center rounded-[4px] cursor-pointer flex-shrink-0"
            style={{ background: "#EEF2F6", width: 52, height: 52 }}
          >
            <Image src="/icons/info-circle.svg" alt="info" width={20} height={20} />
          </button>
        </div>
      </div>
    );
  }

  // Mobile variant
  return (
    <div className="px-4" style={{ marginTop: 32 }}>
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 rounded-[4px] overflow-hidden"
          style={{ width: 56, height: 56 }}
        >
          <Image
            src={seller.image || "/images/product-placeholder.png"}
            alt={seller.name}
            width={56}
            height={56}
            className="object-contain w-full h-full"
          />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span style={{ fontWeight: 400, fontSize: 24, lineHeight: "34px" }}>
            {seller.name}
          </span>
          <StarRow />
        </div>
      </div>

      <button
        onClick={onDetailOpen}
        className="w-full mt-4 rounded-[4px] flex items-center justify-center gap-3 cursor-pointer"
        style={{ background: "#EEF2F6", height: 52 }}
      >
        <span style={{ fontWeight: 400, fontSize: 14, lineHeight: "20px" }}>
          {t("sellerDetails")}
        </span>
        <Image src="/icons/info-circle.svg" alt="info" width={20} height={20} />
      </button>
    </div>
  );
}