"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MyOrdersAll } from "@/services/order";
import { createAtmosPayment } from "@/services/atmos";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface OrderCardProps {
  order: MyOrdersAll;
  onOpenDetails: () => void;
}

const statusColors: Record<string, string> = {
  new: "bg-gray-500",
  assembling: "bg-blue-500",
  delivering: "bg-orange-500",
  processed: "bg-green-500",
  withdrawable: "bg-teal-500",
  cancelled: "bg-red-600",
};

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
  const [paying, setPaying] = useState(false);

  const rawStatus = order.status?.toLowerCase() || "new";
  const statusKey = rawStatus in statusColors ? rawStatus : "new";
  const statusInfo = { label: t(statusKey), color: statusColors[statusKey] };
  // Show pay button for unpaid online (ATMOS) orders; cash orders have no checkout URL
  const canPay =
    !order.isPaid &&
    statusKey !== "cancelled" &&
    (!!order.checkoutUrl || order.paymentType?.toUpperCase() === "ATMOS");

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollWidth > el.clientWidth);
    const onScroll = () => setIsScrolled(el.scrollLeft > 0);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [order.images]);

  const handlePay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use existing checkoutUrl if present, otherwise generate one
    if (order.checkoutUrl) {
      window.location.href = order.checkoutUrl;
      return;
    }
    setPaying(true);
    try {
      const res = await createAtmosPayment(order.id);
      const redirectUrl = res?.checkoutUrl || res?.redirectUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        toast.error(t("noPaymentLink"));
      }
    } catch {
      toast.error(t("paymentError"));
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-[#CDD5DF] py-4 mb-6">
      <div className="flex flex-col gap-3 px-6">
        {/* Info row */}
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="font-medium text-sm">{t("orderDate")}</h1>
            <p className="font-light text-base">{formatDate(order.createdTime)}</p>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-medium text-sm">{t("orderId")}</h1>
            <p className="font-light text-base">Nr {order.id}</p>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-medium text-sm">{t("orderStatus")}</h1>
            <div className="flex items-center gap-2">
              <span className={`rounded-full w-2 h-2 ${statusInfo.color}`}></span>
              <p className="font-light text-base">{statusInfo.label}</p>
            </div>
          </div>
          {/* Buttons: desktop inline */}
          <div className="hidden md:flex items-center gap-2">
            {canPay && (
              <Button
                type="button"
                onClick={handlePay}
                disabled={paying}
                className="uppercase cursor-pointer px-3 py-4 rounded-md bg-black text-white hover:bg-white hover:text-black border border-black text-xs font-normal disabled:opacity-50"
              >
                {paying ? t("payOrderPending") : t("payOrder")}
              </Button>
            )}
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
        </div>
        {/* Buttons: mobile below info */}
        <div className="flex md:hidden items-center gap-2">
          {canPay && (
            <Button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="flex-1 uppercase cursor-pointer px-3 py-4 rounded-md bg-black text-white hover:bg-white hover:text-black border border-black text-xs font-normal disabled:opacity-50"
            >
              {paying ? t("payOrderPending") : t("payOrder")}
            </Button>
          )}
          <Button
            variant="default"
            onClick={onOpenDetails}
            className="flex-1 uppercase text-black cursor-pointer px-2 py-4 rounded-md bg-[#EEF2F6] hover:bg-[#E3E8EF] text-xs font-normal flex items-center justify-center gap-1"
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
