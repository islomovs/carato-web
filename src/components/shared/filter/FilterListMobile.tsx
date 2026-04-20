/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";

export default function FilterListMobile({
  mockFilters,
  selected,
  setMobileActiveFilter,
  setTempSelected,
  setTempPrice,
  price,
  priceRange,
  weightRange,
  priceRangeKey,
  weightKey
}: {
  mockFilters: any[];
  selected: Record<string, string[]>;
  setMobileActiveFilter: (val: string) => void;
  setTempSelected: (val: Record<string, string[]>) => void;
  setTempPrice: (val: [number, number]) => void;
  price: [number, number];
  priceRange: [number, number];
  weightRange: [number, number];
  priceRangeKey: string;
  weightKey: string;
}) {
const appliedCount = (title: string) => {
  if (title === priceRangeKey)
    return priceRange[0] > 0 || priceRange[1] < 50000000 ? 1 : 0;
  if (title === weightKey)
    return weightRange[0] > 0.5 || weightRange[1] < 100 ? 1 : 0;
  return selected[title]?.length ?? 0;
};

  return (
    <div className="overflow-y-auto h-full z-[1000]">
      <div className="px-4 py-4 space-y-4">
        {mockFilters.map((filter) => (
          <div key={filter.title} className="border-b border-[#EEF2F6]">
            <button
              onClick={() => {
                // copy current applied filters & price into temp states
                setTempSelected(selected);
                setTempPrice(price);
                setMobileActiveFilter(filter.title);
              }}
              className="w-full flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-[500]">{filter.title}</span>
                {appliedCount(filter.title) > 0 && (
                  <span className="ml-1 text-gray-500">
                    ({appliedCount(filter.title)})
                  </span>
                )}
              </div>
              <Image
                src="/icons/arrow-narrow-right.svg"
                alt="open"
                width={20}
                height={20}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
