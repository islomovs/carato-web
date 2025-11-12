import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface Props {
  price: [number, number];
  setPrice: (v: [number, number]) => void;
}

export default function FilterPriceRange({ price, setPrice }: Props) {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="relative flex-1">
            <Input
              value={price[i]}
              onChange={(e) => {
                const newVal = Number(e.target.value || 0);
                setPrice(i === 0 ? [newVal, price[1]] : [price[0], newVal]);
              }}
              className="text-[14px] font-[400] pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-gray-500">
              UZS
            </span>
          </div>
        ))}
      </div>
      <div className="px-2">
        <Slider
          value={price}
          min={0}
          max={500000}
          step={1000}
          onValueChange={(v: [number, number]) => setPrice(v)}
        />
      </div>
    </div>
  );
}
