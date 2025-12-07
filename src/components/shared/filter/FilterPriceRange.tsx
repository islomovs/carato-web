import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface Props {
  price: [number, number];
  setPrice: (v: [number, number]) => void;
  filterType: "Цена" | "Вес" | string;
}

export default function FilterPriceRange({
  price,
  setPrice,
  filterType,
}: Props) {
  const isWeight = filterType === "Вес";

  const min = isWeight ? 0.5 : 0;
  const max = isWeight ? 100 : 500000;
  const step = isWeight ? 0.1 : 1000;
  const unit = isWeight ? "гр" : "UZS";

  return (
    <div className="mt-0 space-y-4 h-full py-3">
      <div className="flex items-center gap-6 px-1">
        {[0, 1].map((i) => (
          <div key={i} className="relative flex-1">
            <Input
              type="number"
              value={price[i]}
              min={min}
              max={max}
              step={step}
              onChange={(e) => {
                const newVal = Number(e.target.value || min);
                setPrice(i === 0 ? [newVal, price[1]] : [price[0], newVal]);
              }}
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
          value={price}
          min={min}
          max={max}
          step={step}
          onValueChange={(v: [number, number]) => setPrice(v)}
        />
      </div>
    </div>
  );
}
