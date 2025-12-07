"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { NavButton } from "../../ui/nav-button";
import { Product } from "@/services/product";

interface ProductSizeSelectorProps {
  onOpenNotify: () => void;
  onOpenDetermine: () => void;
  variants?: Product["variants"];
  onSizeSelect?: (variant: Product["variants"][0]) => void; // Return full variant now
}

export default function ProductSizeSelector({
  onOpenNotify,
  onOpenDetermine,
  variants,
  onSizeSelect,
}: ProductSizeSelectorProps) {
  const t = useTranslations("product");

  const safeVariants = variants ?? [];
  // Filter out undefined sizes
  const sizes = safeVariants.filter((v) => v.size?.id && v.size?.name);

  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

  useEffect(() => {
    if (sizes.length > 0 && !selectedSizeId) {
      setSelectedSizeId(sizes[0].size.id!);
      onSizeSelect?.(sizes[0]);
    }
  }, [sizes, selectedSizeId, onSizeSelect]);

  const handleSizeClick = (id: number) => {
    setSelectedSizeId(id);
    const variant = sizes.find((v) => v.size.id === id);
    if (variant) {
      onSizeSelect?.(variant);
    }
  };

  const selectedSizeName =
    sizes.find((v) => v.size.id === selectedSizeId)?.size.name ?? "";

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-[#667085] text-[12px] font-normal text-start">
        {t("size", { size: selectedSizeName })}
      </p>

      <div className="flex gap-2">
        {sizes.map((v) => {
          const isSelected = v.size.id === selectedSizeId;
          return (
            <Button
              key={v.size.id}
              onClick={() => handleSizeClick(v.size.id!)}
              className={`w-[36px] h-[36px] rounded-[4px] text-[12px] font-normal cursor-pointer
                ${
                  isSelected
                    ? "bg-black text-white border border-black hover:bg-black hover:text-white"
                    : "bg-white text-black border border-black hover:bg-gray-100"
                }`}
              variant="ghost"
            >
              {v.size.name}
            </Button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <NavButton
          className="text-[12px] font-normal text-black uppercase"
          underlineColor="black"
          active
          onClick={onOpenDetermine}
        >
          {t("defineSize")}
        </NavButton>
        <NavButton
          className="text-[12px] font-normal text-black uppercase"
          underlineColor="black"
          active
          onClick={onOpenNotify}
        >
          {t("noSize")}
        </NavButton>
      </div>
    </div>
  );
}
