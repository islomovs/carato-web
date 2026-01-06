/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { Button } from "../../ui/button";
import { Control, useController } from "react-hook-form";
import { useTranslations } from "next-intl";

type PaymentOption = "CLICK" | "PAYME" | "CASH";

interface PaymentTypesSectionProps {
  control?: Control<any>;
  name: string;
  isDesktopColumn?: boolean;
}

export default function PaymentTypesSection({
  control,
  name,
  isDesktopColumn = false,
}: PaymentTypesSectionProps) {
  const t = useTranslations("checkout");
  const { field } = useController({
    control,
    name,
  });

  return (
    <div
      className={`${isDesktopColumn ? "md:block hidden" : "md:hidden pt-6"}`}
    >
      <h3
        className={`${isDesktopColumn && "md:hidden"} text-[14px] font-medium mb-4`}
      >
        {t("paymentMethod")}
      </h3>

      <div className="flex flex-row gap-3">
        {(
          [
            { key: "CLICK", label: "Click" },
            { key: "PAYME", label: "Payme" },
            { key: "CASH", label: "Наличными" },
          ] as { key: PaymentOption; label: string }[]
        ).map((opt) => {
          const selected = field.value === opt.key;
          return (
            <Button
              type="button"
              key={opt.key}
              variant="default"
              onClick={() => field.onChange(opt.key)}
              className={`w-full flex-1 flex items-center gap-3 justify-center py-[25px] rounded-md border border-black cursor-pointer hover:bg-black hover:text-white ${
                selected ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    selected
                      ? "block bg-white"
                      : "hidden bg-transparent border border-[#D1D5DB]"
                  }`}
                >
                  <Image
                    src="/icons/check.svg"
                    alt="check"
                    width={12}
                    height={12}
                  />
                </div>
                <span
                  className={`${selected ? "font-medium" : "font-normal"} text-[14px]`}
                >
                  {opt.label}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
