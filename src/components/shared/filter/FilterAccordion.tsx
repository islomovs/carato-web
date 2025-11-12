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
  price: [number, number];
  setPrice: (val: [number, number]) => void;
  appliedCount: (title: string) => number;
}

export default function FilterAccordion({
  filter,
  expanded,
  setExpanded,
  isOptionActive,
  toggleOption,
  price,
  setPrice,
  appliedCount,
}: Props) {
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
          {filter.title === "Цена" && (price[0] > 0 || price[1] < 500000) && (
            <span className="ml-1 text-gray-500">(1)</span>
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
            {filter.title === "Цена" ? (
              <FilterPriceRange price={price} setPrice={setPrice} />
            ) : (
              <FilterOptionsList
                title={filter.title}
                options={filter.options}
                isOptionActive={isOptionActive}
                toggleOption={toggleOption}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
