import { MyOrderItem } from "@/services/order";
import OrderInfoRow from "./OrderInfoRow";
import { useTranslations } from "next-intl";

function formatDate(iso: string) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}
interface OrderDetailsInfoProps {
  order: MyOrderItem;
}

export default function OrderDetailsInfo({ order }: OrderDetailsInfoProps) {
  const t = useTranslations("profile");

  const statusMap: Record<string, { label: string; color: string }> = {
    new: { label: t("new"), color: "bg-gray-500" },
    assembling: { label: t("assembling"), color: "bg-blue-500" },
    delivering: { label: t("delivering"), color: "bg-orange-500" },
    cancelled: { label: t("cancelled"), color: "bg-red-600" },
  };

  return (
    <>
      <div>
        <OrderInfoRow
          label={t("status")}
          value={
            <span className={`flex items-center gap-2`}>
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
              ? formatDate(order.deliveryPreferredTime)
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
      </div>
    </>
  );
}
