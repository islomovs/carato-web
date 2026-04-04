"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Seller } from "@/services/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SellerDetailDialogProps {
  seller: Seller;
  open: boolean;
  onClose: () => void;
}

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

export default function SellerDetailDialog({
  seller,
  open,
  onClose,
}: SellerDetailDialogProps) {
  const t = useTranslations("seller");

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
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="p-10 max-w-[520px] w-full rounded-lg z-[80]"
        style={{ background: "white" }}
      >
        <DialogHeader>
          <DialogTitle
            style={{ fontWeight: 400, fontSize: 24, lineHeight: "34px" }}
          >
            {t("aboutSeller")}
          </DialogTitle>
        </DialogHeader>

        {/* Stats list */}
        <div className="flex flex-col" style={{ marginTop: 40 }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
              style={{ height: 64 }}
            >
              {/* Left: icon + label */}
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center rounded-[4px] flex-shrink-0"
                  style={{ width: 40, height: 40, background: "#EEF2F6" }}
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
                    color: "#000",
                  }}
                >
                  {stat.label}
                </span>
              </div>

              {/* Right: value badge */}
              <div
                className="flex items-center justify-center rounded-[4px] px-3 flex-shrink-0"
                style={{ background: "#EEF2F6", minWidth: 48, height: 32 }}
              >
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: "18px",
                    color: "#000",
                  }}
                >
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Close button */}
        <Button
          onClick={onClose}
          className="w-full mt-10 bg-black text-white border border-black hover:bg-white hover:text-black cursor-pointer font-normal uppercase rounded-md"
          style={{ height: 52, fontSize: 14, lineHeight: "20px" }}
        >
          {t("understood")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}