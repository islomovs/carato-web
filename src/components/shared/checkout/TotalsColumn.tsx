/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control } from "react-hook-form";
import { Button } from "../../ui/button";
import PaymentTypesSection from "./PaymentMethodsSection";
import PromocodeField from "./PromocodeField";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";

type TotalsColumnProps = {
  totalPrice: number;
  savings: number;
  count: number;
  control?: Control<any>;
  isCheckoutPage?: boolean;
};

export function TotalsColumn({
  totalPrice,
  savings,
  count,
  control,
  isCheckoutPage = false,
}: TotalsColumnProps) {
  const t = useTranslations("cart");
  const router = useRouter();

  return (
    <div className="w-full md:max-w-[400px] bg-[#F8FAFC] flex flex-col self-stretch fixed md:static bottom-0 left-0 z-40 border-t md:border-0 border-[#E5E7EB] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-none">
      <div
        className="
          flex flex-col px-4 md:px-8 py-3 md:py-[126px]
          sticky top-auto md:top-0
        "
      >
        <h1 className="text-base font-normal mb-4">{t("yourOrder")}</h1>
        <div className="flex justify-between text-xs md:text-base font-medium">
          <span>
            {count} {t("items")}
          </span>
          <div className="flex-1 border-b border-dotted border-black h-[14px] md:h-[18px]" />
          <span>
            {formatPrice(totalPrice)} {t("uzs")}
          </span>
        </div>

        <div className="flex justify-between mt-0.5 md:mt-2 text-xs md:text-sm font-normal">
          <span>{t("savings")}</span>
          <div className="flex-1 border-b border-dotted border-black h-[14px] md:h-4" />
          <span className="text-[#F04438]">
            {formatPrice(savings)} {t("uzs")}
          </span>
        </div>

        {isCheckoutPage && (
          <>
            <div className="flex justify-between mt-0.5 md:mt-2 text-xs md:text-sm font-medium">
              <span>{t("toPay")}</span>
              <div className="flex-1 border-b border-dotted border-black h-[14px] md:h-4" />
              <span>
                {formatPrice(totalPrice)} {t("uzs")}
              </span>
            </div>
            <PromocodeField
              control={control}
              name="promocode"
              isDesktopColumn
            />
            <PaymentTypesSection
              control={control}
              name="paymentType"
              isDesktopColumn
            />
            <hr className="border-t border-[#EEF2F6] mt-6" />
          </>
        )}

        <Button
          variant="default"
          onClick={
            !isCheckoutPage
              ? () => {
                  router.push("/checkout");
                }
              : undefined
          }
          type={isCheckoutPage ? "submit" : "button"}
          className="
            uppercase w-full mt-3 md:mt-6 h-[52px]
            font-medium text-sm bg-black text-white rounded-[10px] hover:bg-white hover:text-black border border-black cursor-pointer
          "
        >
          {isCheckoutPage ? t("placeOrderButton") : t("checkoutButton")}
        </Button>
      </div>
    </div>
  );
}
