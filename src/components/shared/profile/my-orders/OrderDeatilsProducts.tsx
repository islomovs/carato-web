import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MyOrderItem } from "@/services/order";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const monthsRu = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function formatDeliveryDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${monthsRu[d.getMonth()]}`;
}

interface OrderDetailsProductsProps {
  order: MyOrderItem;
}

export default function OrderDetailsProducts({
  order,
}: OrderDetailsProductsProps) {
  const t = useTranslations("profile");
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 px-4 py-6 md:px-0 md:py-0">
      {order.products.map((item, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center border-b-[0.5px] border-b-black">
            <div className="flex flex-row gap-1">
              <p className="font-normal text-xs text-[#697586]">
                {t("deliveryDate")}
              </p>
              <p className="font-medium text-xs">
                {formatDeliveryDate(order.deliveryPreferredTime)}
              </p>
            </div>
            <Button
              variant="link"
              onClick={() => router.push(`/product/${item.product.slug}`)}
              className="p-0 cursor-pointer font-normal uppercase text-black flex flex-row gap-2"
            >
              {t("showProducts")}
              <Image
                src="/icons/arrow-narrow-right.svg"
                alt="Arrow right"
                width={20}
                height={20}
              />
            </Button>
          </div>
          <div
            className="flex flex-row gap-5 items-start cursor-pointer"
            onClick={() => router.push(`/product/${item.product.slug}`)}
          >
            <div className="w-16 h-16">
              <Image
                src={
                  item.product.images[0]?.image
                    ? item.product.images[0].image
                    : "/images/product-placeholder.png"
                }
                alt="Product placeholder"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="font-normal text-sm">{item.product.name}</p>
              <div className="flex flex-row justify-between">
                <p className="font-normal text-xs text-[#697586]">
                  {item.quantity} {t("pcs")}
                </p>
                <p className="font-normal text-xs text-[#697586]">
                  {item.product.variants[0]?.size.name || "-"} {t("size")}
                </p>
              </div>
            </div>
            <div>
              <p className="font-normal text-sm">
                {item.totalPrice} {t("uzs")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
