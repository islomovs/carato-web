"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { NavButton } from "../ui/nav-button";

interface ProductSizeSelectorProps {
  onOpenNotify: () => void;
  onOpenDetermine: () => void;
}

export default function ProductSizeSelector({
  onOpenNotify,
  onOpenDetermine,
}: ProductSizeSelectorProps) {
  const sizes = ["50", "52", "54", "56"];
  const [selectedSize, setSelectedSize] = useState("52");
  const t = useTranslations("product");

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-[#667085] text-[12px] font-normal text-start">
        {t("size", { size: selectedSize })}
      </p>

      <div className="flex gap-2">
        {sizes.map((size) => {
          const isSelected = size === selectedSize;
          return (
            <Button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-[36px] h-[36px] rounded-[4px] text-[12px] font-normal cursor-pointer
                ${
                  isSelected
                    ? "bg-black text-white border border-black hover:bg-black hover:text-white"
                    : "bg-white text-black border border-black"
                }`}
              variant="ghost"
            >
              {size}
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
