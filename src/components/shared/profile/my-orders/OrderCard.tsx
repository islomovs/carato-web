"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MyOrdersAll } from "@/services/order";
import { useTranslations } from "next-intl";

interface OrderCardProps {
  order: MyOrdersAll;
  onOpenDetails: () => void;
}

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: "Новый", color: "bg-gray-500" },
  assembling: { label: "В сборке", color: "bg-blue-500" },
  delivering: { label: "В доставке", color: "bg-orange-500" },
  processed: { label: "В обработке", color: "bg-green-500" },
  withdrawable: { label: "Доступен к выводу", color: "bg-teal-500" },
  cancelled: { label: "Отменён", color: "bg-red-600" },
};

// helper function
function formatDate(iso: string) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function OrderCard({ order, onOpenDetails }: OrderCardProps) {
  const t = useTranslations("profile");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const statusKey = order.status?.toLowerCase() || "new";
  const statusInfo = statusMap[statusKey] || statusMap.new;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check overflow for scrollbar
    setIsOverflowing(el.scrollWidth > el.clientWidth);

    const onScroll = () => setIsScrolled(el.scrollLeft > 0);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [order.images]);

  return (
    <div className="flex flex-col gap-4 border border-[#CDD5DF] py-4 mb-6">
      <div className="flex flex-row justify-between px-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-sm">{t("orderDate")}</h1>
          <p className="font-light text-base">
            {formatDate(order.createdTime)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-sm">{t("orderId")}</h1>
          <p className="font-light text-base">№ {order.id}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-sm">{t("orderStatus")}</h1>
          <div className="flex items-center gap-2">
            <span className={`rounded-full w-2 h-2 ${statusInfo.color}`}></span>
            <p className="font-light text-base">{statusInfo.label}</p>
          </div>
        </div>
        <Button
          variant="default"
          onClick={onOpenDetails}
          className="uppercase text-black cursor-pointer px-2 py-4 rounded-md bg-[#EEF2F6] hover:bg-[#E3E8EF] text-xs font-normal flex items-center gap-1"
        >
          {t("orderDetails")}
          <Image
            src="/icons/arrow-narrow-right.svg"
            alt="Arrow right"
            width={20}
            height={20}
          />
        </Button>
      </div>

      <div
        ref={scrollRef}
        className={`flex flex-row gap-2 transition-all duration-200 ${
          isOverflowing ? "overflow-x-scroll" : "overflow-x-hidden"
        } ${isScrolled ? "px-0" : "px-6"}`}
      >
        {order.images.map((img, i) => (
          <Image
            key={i}
            src={img.image || "/images/product-placeholder.png"}
            alt={`Product ${i}`}
            width={64}
            height={64}
            className="flex-shrink-0 object-cover"
          />
        ))}
      </div>
    </div>
  );
}
