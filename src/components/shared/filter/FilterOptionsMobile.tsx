import Image from "next/image";
import FilterPriceRange from "./FilterPriceRange";

interface FilterOption {
  title: string;
  options: string[];
}

interface Props {
  title: string;
  mockFilters: FilterOption[];
  selected: Record<string, string[]>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  price: [number, number];
  setPrice: (v: [number, number]) => void;
  isSingleSelect?: boolean;
  filterType?: "price" | "weight" | "sort" | "metal" | "other";
}

export default function FilterOptionsMobile({
  title,
  mockFilters,
  selected,
  setSelected,
  price,
  setPrice,
  isSingleSelect = false,
  filterType = "other",
}: Props) {
  const isRange = filterType === "price" || filterType === "weight";

  const toggleOption = (filter: string, option: string) => {
    setSelected((prev) => {
      if (isSingleSelect) {
        // Single select — replace entirely or deselect
        const already = prev[filter]?.[0] === option;
        const copy = { ...prev };
        if (already) {
          delete copy[filter];
        } else {
          copy[filter] = [option];
        }
        return copy;
      }
      // Multi-select
      const exists = prev[filter]?.includes(option);
      const newOptions = exists
        ? prev[filter].filter((o) => o !== option)
        : [...(prev[filter] ?? []), option];
      const copy = { ...prev, [filter]: newOptions };
      if (newOptions.length === 0) delete copy[filter];
      return copy;
    });
  };

  const isOptionActive = (filter: string, option: string) => {
    if (isSingleSelect) return selected[filter]?.[0] === option;
    return !!selected[filter]?.includes(option);
  };

  const options = mockFilters.find((f) => f.title === title)?.options ?? [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {isRange ? (
          <FilterPriceRange
            price={price}
            setPrice={setPrice}
            filterType={filterType}
          />
        ) : (
          options.map((option) => (
            <button
              key={option}
              onClick={() => toggleOption(title, option)}
              className="w-full flex items-center justify-between py-3 border-b border-[#EEF2F6] text-[14px] font-[500]"
            >
              <span>{option}</span>
              {isSingleSelect ? (
                <span
                  className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors
                    ${isOptionActive(title, option) ? "border-black bg-black" : "border-[#9AA4B2]"}`}
                >
                  {isOptionActive(title, option) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
              ) : (
                isOptionActive(title, option) && (
                  <Image
                    src="/icons/check.svg"
                    alt="check"
                    width={16}
                    height={16}
                  />
                )
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
