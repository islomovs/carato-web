import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface FilterPriceRangeProps {
  price: [number, number];
  setPrice: (v: [number, number]) => void;
  filterType: "price" | "weight" | string;
}

export default function FilterPriceRange({
  price,
  setPrice,
  filterType,
}: FilterPriceRangeProps) {
  const t = useTranslations("filters");
  const isWeight = filterType === "weight";

  const min = isWeight ? 0.5 : 0;
  const max = isWeight ? 100 : 50000000;
  const step = isWeight ? 0.1 : 1000;
  const unit = isWeight ? t("gr") : "UZS";

  // Local state for smooth slider movement — only commits to parent on release
  const [localPrice, setLocalPrice] = useState<[number, number]>(price);

  // FilterPriceRange — replace the sync useEffect:
  useEffect(() => {
    setLocalPrice(price);
  }, [price]);

  const handleInputChange = (i: 0 | 1, raw: string) => {
    const val = raw === "" ? (i === 0 ? min : max) : Number(raw);
    const next: [number, number] =
      i === 0 ? [val, localPrice[1]] : [localPrice[0], val];
    setLocalPrice(next); // only update local — no parent call yet
  };

  const handleInputBlur = () => {
    // Clamp and validate on blur, then commit to parent
    const clamped: [number, number] = [
      Math.min(Math.max(localPrice[0], min), localPrice[1]),
      Math.max(Math.min(localPrice[1], max), localPrice[0]),
    ];
    setLocalPrice(clamped);
    setPrice(clamped);
  };

  return (
    <div className="mt-0 space-y-4 h-full py-3">
      <div className="flex items-center gap-6 px-1">
        {([0, 1] as (0 | 1)[]).map((i) => (
          <div key={i} className="relative flex-1">
            <Input
              type="number"
              value={localPrice[i]}
              min={min}
              max={max}
              step={step}
              onChange={(e) => handleInputChange(i, e.target.value)}
              onBlur={() => handleInputBlur()}
              className="text-[14px] font-[400] pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-gray-500">
              {unit}
            </span>
          </div>
        ))}
      </div>

      <div className="px-2">
        <Slider
          value={localPrice}
          min={min}
          max={max}
          step={step}
          onValueChange={(v) => setLocalPrice(v as [number, number])} // smooth visual only
          onValueCommit={(v) => setPrice(v as [number, number])} // fires API on release
        />
      </div>
    </div>
  );
}
