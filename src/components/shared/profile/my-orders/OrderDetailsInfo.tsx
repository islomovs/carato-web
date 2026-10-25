"use client";

import { MyOrderItem } from "@/services/order";
import { createAtmosPayment } from "@/services/atmos";
import OrderInfoRow from "./OrderInfoRow";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

interface OrderDetailsInfoProps {
  order: MyOrderItem;
}

export default function OrderDetailsInfo({ order }: OrderDetailsInfoProps) {
  const t = useTranslations("profile");
  const [paying, setPaying] = useState(false);

  const statusMap: Record<string, { label: string; color: string }> = {
    new: { label: t("new"), color: "bg-gray-500" },
    assembling: { label: t("assembling"), color: "bg-blue-500" },
    delivering: { label: t("delivering"), color: "bg-orange-500" },
    processed: { label: t("processed"), color: "bg-green-500" },
    withdrawable: { label: t("withdrawable"), color: "bg-teal-500" },
    cancelled: { label: t("cancelled"), color: "bg-red-600" },
  };

  const canPay =
    !order.isPaid &&
    order.paymentType?.toUpperCase() === "ATMOS" &&
    order.status?.toLowerCase() !== "cancelled";

  const handlePay = async () => {
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
    <>
      <div>
        <OrderInfoRow
          label={t("status")}
          value={
            <span className="flex items-center gap-2">
              <span
                className={`rounded-full w-2 h-2 ${
                  statusMap[order.status?.toLowerCase() || "new"]?.color
                }`}
              />
              {statusMap[order.status?.toLowerCase() || "new"]?.label}
            </span>
          }
        />
        <OrderInfoRow label={t("date")} value={formatDate(order.createdTime)} />
        <OrderInfoRow label={t("fullName")} value={order.fullName} />
        <OrderInfoRow label={t("phone")} value={order.phone} />
        <OrderInfoRow
          label={t("deliveryAddress")}
          value={`${order.address}${order.apartmentNumber ? `, кв. ${order.apartmentNumber}` : ""}${
            order.entrance ? `, подъезд ${order.entrance}` : ""
          }${order.floor ? `, этаж ${order.floor}` : ""}`}
        />
        <OrderInfoRow label={t("deliveryMethod")} value={order.deliveryType} />
        <OrderInfoRow
          label={t("preferredDeliveryTime")}
          value={
            order.deliveryPreferredTime
              ? formatDateTime(order.deliveryPreferredTime)
              : "-"
          }
        />
      </div>
      <div>
        <OrderInfoRow
          label={t("paymentStatus")}
          value={
            <span className="flex items-center gap-2">
              <span
                className={`rounded-full w-2 h-2 ${order.isPaid ? "bg-[#17B26A]" : "bg-gray-500"}`}
              />
              {order.isPaid ? t("paid") : t("notPaid")}
            </span>
          }
        />
        <OrderInfoRow
          label={t("totalAmount")}
          value={`${order.totalSum} ${t("uzs")}`}
        />
        <OrderInfoRow label={t("comment")} value={order.comment || "-"} />
        {order.promocode && (
          <OrderInfoRow
            label={t("promocode")}
            value={`${order.promocode.code} -${order.promocode.discountPrice} ${t("uzs")}`}
          />
        )}

        {canPay && (
          <Button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="mt-4 w-full h-[52px] uppercase font-medium text-sm bg-black text-white rounded-[10px] hover:bg-white hover:text-black border border-black cursor-pointer disabled:opacity-50 mx-4 md:mx-0 w-[calc(100%-32px)] md:w-full"
          >
            {paying ? t("payOrderPending") : t("payOrder")}
          </Button>
        )}
      </div>
    </>
  );
}
