import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import FilterOptionsList from "./FilterOptionsList";
import FilterPriceRange from "./FilterPriceRange";
import { FilterOption } from "./types";

interface Props {
  filter: FilterOption;
  expanded: string | null;
  setExpanded: (title: string | null) => void;
  isOptionActive: (title: string, opt: string) => boolean;
  toggleOption: (title: string, opt: string) => void;
  priceRange: [number, number];
  setPriceRange: (val: [number, number]) => void;
  weightRange: [number, number];
  setWeightRange: (val: [number, number]) => void;
  appliedCount: (title: string) => number;
  isSingleSelect?: boolean;
  filterType?: "price" | "weight" | "sort" | "metal" | "other";
}

export default function FilterAccordion({
  filter,
  expanded,
  setExpanded,
  isOptionActive,
  toggleOption,
  priceRange,
  setPriceRange,
  weightRange,
  setWeightRange,
  appliedCount,
  isSingleSelect = false,
  filterType = "other",
}: Props) {
  const isRange = filterType === "price" || filterType === "weight";

  return (
    <div className="mb-0">
      <button
        onClick={() =>
          setExpanded(expanded === filter.title ? null : filter.title)
        }
        className="w-full flex justify-between items-center py-4 border-b border-[#EEF2F6] cursor-pointer"
      >
        <span className="text-[14px] font-[500]">
          {filter.title}
          {appliedCount(filter.title) > 0 && (
            <span className="ml-1 text-gray-500">
              ({appliedCount(filter.title)})
            </span>
          )}
        </span>
        {expanded === filter.title ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </button>

      <AnimatePresence>
        {expanded === filter.title && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {isRange ? (
              <FilterPriceRange
                price={filterType === "price" ? priceRange : weightRange}
                setPrice={
                  filterType === "price" ? setPriceRange : setWeightRange
                }
                filterType={filterType}
              />
            ) : (
              <FilterOptionsList
                title={filter.title}
                options={filter.options}
                isOptionActive={isOptionActive}
                toggleOption={toggleOption}
                isSingleSelect={isSingleSelect}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
