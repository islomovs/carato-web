/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { Button } from "../../ui/button";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

interface DeliveryOptionsSectionProps {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export function DeliveryOptionsSection({
  watch,
  setValue,
}: DeliveryOptionsSectionProps) {
  const t = useTranslations("checkout");
  const selected = watch("deliveryType");

  const options = [
    { key: "courier", label: t("deliveryTypes.courier") },
    { key: "yandex", label: t("deliveryTypes.yandex") },
  ];

  return (
    <div>
      <h3 className="text-[14px] md:text-base mb-4">{t("deliveryOptions")}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {options.map((opt: { key: string; label: string }) => {
          const isSelected = selected === opt.key;

          return (
            <Button
              key={opt.key}
              type="button"
              variant="default"
              onClick={() =>
                setValue("deliveryType", opt.key, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: false,
                })
              }
              className={`w-full flex items-center justify-center px-3 py-[25px] rounded-md border border-black cursor-pointer hover:bg-black hover:text-white ${
                isSelected ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    isSelected ? "bg-white text-black" : "hidden"
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
                  className={`${isSelected ? "font-medium" : "font-normal"} text-[14px]`}
                >
                  {opt.label}
                </span>
              </div>

              {/* price hint or nothing */}
              {/* <span className="text-sm text-[#6B7280]">
                        от 15 000 UZS
                      </span> */}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
