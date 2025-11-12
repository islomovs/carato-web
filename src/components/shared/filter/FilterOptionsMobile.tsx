/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function FilterOptionsMobile({
  title,
  mockFilters,
  selected,
  setSelected,
  price,
  setPrice,
}: any) {
  const toggleOption = (filter: string, option: string) => {
    setSelected((prev: any) => {
      const exists = prev[filter]?.includes(option);
      const newOptions = exists
        ? prev[filter].filter((o: string) => o !== option)
        : [...(prev[filter] ?? []), option];
      return { ...prev, [filter]: newOptions };
    });
  };

  const isOptionActive = (filter: string, option: string) =>
    selected[filter]?.includes(option);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {title === "Цена" ? (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Input
                type="number"
                value={price[0]}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setPrice([newValue, price[1]]);
                  setSelected((prev: any) => ({
                    ...prev,
                    Цена: ["Диапазон"],
                  }));
                }}
                className="w-[45%] text-center"
              />
              <span className="text-gray-400">—</span>
              <Input
                type="number"
                value={price[1]}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setPrice([price[0], newValue]);
                  setSelected((prev: any) => ({
                    ...prev,
                    Цена: ["Диапазон"],
                  }));
                }}
                className="w-[45%] text-center"
              />
            </div>
            <Slider
              value={price}
              onValueChange={(v) => {
                setPrice([v[0], v[1]]);
                // 👇 Mark "Цена" as selected when user interacts with slider
                setSelected((prev: any) => ({
                  ...prev,
                  Цена: ["Диапазон"], // dummy non-empty array just to trigger (1)
                }));
              }}
              min={0}
              max={500000}
              step={5000}
            />
          </div>
        ) : (
          mockFilters
            .find((f: { title: string }) => f.title === title)
            ?.options.map((option: string) => (
              <button
                key={option}
                onClick={() => toggleOption(title, option)}
                className="w-full flex items-center justify-between py-3 border-b border-[#EEF2F6] text-[14px] font-[500]"
              >
                <span>{option}</span>
                {isOptionActive(title, option) && (
                  <Image
                    src="/icons/check.svg"
                    alt="check"
                    width={16}
                    height={16}
                  />
                )}
              </button>
            ))
        )}
      </div>
    </div>
  );
}
