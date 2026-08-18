/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "../../ui/input";
import { useController, Control } from "react-hook-form";
import { calculatePromocode } from "@/services/promocode";
import { useTranslations } from "next-intl";

interface PromocodeFieldProps {
  control?: Control<any>;
  name: string;
  isDesktopColumn?: boolean;
  orderPrice?: number;
  onApplied?: (discountAmount: number) => void;
}

export default function PromocodeField({
  control,
  name,
  isDesktopColumn = false,
  orderPrice = 0,
  onApplied,
}: PromocodeFieldProps) {
  const t = useTranslations("checkout");
  const { field } = useController({ control, name, defaultValue: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number | null>(null);

  const handleApply = async () => {
    const code = (field.value as string)?.trim();
    if (!code) return;

    setLoading(true);
    setError(null);
    setDiscountAmount(null);

    try {
      const result = await calculatePromocode(code, orderPrice);
      if (result.promocodeDiscountAmount > 0) {
        setDiscountAmount(result.promocodeDiscountAmount);
        onApplied?.(result.promocodeDiscountAmount);
      } else {
        setError(t("promo.notValid"));
      }
    } catch {
      setError(t("promo.notValid"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value.toUpperCase());
    // Reset result when user edits the code
    setError(null);
    setDiscountAmount(null);
    onApplied?.(0);
  };

  return (
    <div
      className={`${isDesktopColumn ? "md:block hidden" : "md:hidden mb-10 border-y border-[#EEF2F6]"} py-6`}
    >
      <div className="relative">
        <Input
          type="text"
          value={field.value ?? ""}
          onChange={handleChange}
          onBlur={field.onBlur}
          ref={field.ref}
          placeholder={t("promo.placeholder")}
          className="w-full border-b border-black py-3 pr-28 text-sm bg-white uppercase"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !field.value}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#EEF2F6] rounded-md px-3 py-[5px] text-[12px] font-medium cursor-pointer disabled:opacity-50"
        >
          {loading ? "..." : t("promo.apply")}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-[#F04438]">{error}</p>
      )}
      {discountAmount !== null && (
        <p className="mt-2 text-xs text-[#17B26A]">
          {t("promo.applied")} −{discountAmount.toLocaleString()} {t("uzs")}
        </p>
      )}
    </div>
  );
}
