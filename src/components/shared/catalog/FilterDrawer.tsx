/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterHeader from "../filter/FilterHeader";
import FilterAccordion from "../filter/FilterAccordion";
import FilterFooter from "../filter/FilterFooter";
import FilterListMobile from "../filter/FilterListMobile";
import FilterOptionsMobile from "../filter/FilterOptionsMobile";
import FilterChipsMobile from "../filter/FilterChipsMobile";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { INITIAL_FILTERS } from "@/services/product";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  total: number;
  selected: Record<string, string[]>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  onUpdateFilters: (filters: Partial<typeof INITIAL_FILTERS>) => void;
}

type FilterOption = {
  title: string;
  options: string[];
};

const mockFilters: FilterOption[] = [
  {
    title: "Сортировка",
    options: ["Новинки", "Лучшее по оценке", "Дешевле", "Дороже"],
  },
  {
    title: "Металл",
    options: [],
  },
  {
    title: "Цена",
    options: [],
  },
  {
    title: "Вес",
    options: [],
  },
];

// Load metals from backend

// Map UI filter values to API params

export default function FilterDrawer({
  open,
  onClose,
  total,
  selected,
  setSelected,
  onUpdateFilters,
}: FilterDrawerProps) {
  const metalsList = [
    { id: 1, name: "Золото 585", fineness: "585" },
    { id: 2, name: "Золото 750", fineness: "750" },
    { id: 3, name: "Серебро 925", fineness: "925" },
    { id: 4, name: "Платина 950", fineness: "950" },
  ];

  const FILTER_MAP = {
    Материал: {
      apiKey: "metals",
      mapValue: (option: string) => {
        console.log("🔹 Mapping metal option:", option);
        const metal = metalsList.find((m) => m.fineness === option);
        if (!metal) console.warn("⚠️ Metal not found for option:", option);
        return metal ? metal.id : null;
      },
    },
    Категория: {
      apiKey: "categorySlug",
      mapValue: (option: string) => option.toLowerCase().replace(/\s+/g, "-"),
    },
    Цена: {
      apiKey: "price",
      mapValue: null,
    },
  };

  // Expanded accordion for desktop
  const [expanded, setExpanded] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [weightRange, setWeightRange] = useState<[number, number]>([0.5, 100]);

  // isMobile determined at runtime (client)
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Mobile: which filter is drilled-in (null -> main list)
  const [mobileActiveFilter, setMobileActiveFilter] = useState<string | null>(
    null
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // helper - check whether an option active
  const isOptionActive = (title: string, option: string) =>
    !!selected[title]?.includes(option);

  // toggle selection (parent-owned)
  const toggleOption = (title: string, option: string) => {
    setSelected((prev) => {
      const exists = prev[title]?.includes(option);
      const newOptions = exists
        ? prev[title].filter((o) => o !== option)
        : [...(prev[title] || []), option];
      const updated = { ...prev, [title]: newOptions };
      if (newOptions.length === 0) delete updated[title];
      return updated;
    });
  };

  // Price: when changed, reflect into `selected` as "Цена": ["min-max"] OR remove if default
  useEffect(() => {
    // if price in default state remove "Цена" from selected
    setSelected((prev) => {
      const priceApplied = priceRange[0] > 0 || priceRange[1] < 500000;
      if (!priceApplied) {
        if (!prev["Цена"]) return prev;
        const copy = { ...prev };
        delete copy["Цена"];
        return copy;
      } else {
        const copy = { ...prev, Цена: [`${priceRange[0]}-${priceRange[1]}`] };
        return copy;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange]);

  // Weight: when changed, reflect into `selected` as "Вес": ["min-max"] OR remove if default
  useEffect(() => {
    setSelected((prev) => {
      const weightApplied = weightRange[0] > 0.5 || weightRange[1] < 100;
      if (!weightApplied) {
        if (!prev["Вес"]) return prev;
        const copy = { ...prev };
        delete copy["Вес"];
        return copy;
      } else {
        const copy = { ...prev, Вес: [`${weightRange[0]}-${weightRange[1]}`] };
        return copy;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightRange]);

  const appliedCount = (title: string) => {
    if (title === "Цена" && selected["Цена"]) {
      return 1; // only count once from selected
    }
    if (title === "Вес" && selected["Вес"]) {
      return 1;
    }
    return selected[title]?.length || 0;
  };

  const hasFilters =
    Object.values(selected).some((a) => a && a.length > 0) ||
    priceRange[0] > 0 ||
    priceRange[1] < 500000 ||
    weightRange[0] > 0.5 ||
    weightRange[1] < 100;

  const [loading, setLoading] = useState(false);

  const clearAll = () => {
    setSelected({});
    setPriceRange([0, 500000]);
    setWeightRange([0.5, 100]);

    setLoading(true);
    onUpdateFilters({});

    toast.success("Все фильтры сброшены");
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const [tempSelected, setTempSelected] = useState<Record<string, string[]>>(
    {}
  );
  const [tempPrice, setTempPrice] = useState<[number, number] | null>(null);

  const applyFilters = () => {
    const apiFilters: any = {};

    apiFilters.priceFrom = priceRange[0] > 0 ? priceRange[0] : null;
    apiFilters.priceTo = priceRange[1] < 500000 ? priceRange[1] : null;

    apiFilters.weightFrom = weightRange[0] > 0.5 ? weightRange[0] : null;
    apiFilters.weightTo = weightRange[1] < 100 ? weightRange[1] : null;

    if (selected["Материал"]) {
      const ids = selected["Материал"]
        .map((name) => FILTER_MAP["Материал"].mapValue(name))
        .filter(Boolean);

      apiFilters.metals = ids;
    }

    if (selected["Категория"]) {
      apiFilters.categorySlug = selected["Категория"].map((name) =>
        name.toLowerCase().replace(/\s+/g, "-")
      );
    }

    // <-- DEBUG: log payload
    console.log("🔥 API Filters Payload before sending:", apiFilters);

    sessionStorage.setItem("productFilters", JSON.stringify(apiFilters));

    if (typeof (window as any).updateFilters === "function") {
      (window as any).updateFilters(apiFilters);
      console.log("🔥 updateFilters called with:", apiFilters);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#00000040] z-[55]"
            onClick={onClose}
          />

          {/* Main Panel - mobile full screen or desktop drawer */}
          {!isMobile ? (
            // DESKTOP: right-side drawer (520px or 90vw)
            <motion.div
              key="drawer-desktop"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-4 right-4 bottom-4 bg-white rounded-lg shadow-lg w-[90vw] sm:w-[520px] max-w-[520px] z-[60] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <FilterHeader onClose={onClose} variant="desktop" />

              {/* Body: accordion style */}
              <div className="flex-1 overflow-y-auto px-10 pt-5 pb-6 space-y-8">
                {mockFilters.map((filter) => (
                  <FilterAccordion
                    key={filter.title}
                    filter={filter}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    isOptionActive={isOptionActive}
                    toggleOption={toggleOption}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    weightRange={weightRange}
                    setWeightRange={setWeightRange}
                    appliedCount={appliedCount}
                  />
                ))}
              </div>

              {/* Footer: Clear + Show results */}
              <FilterFooter
                hasFilters={hasFilters}
                total={total}
                onClear={clearAll}
                onApply={applyFilters}
                loading={loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="layer-mobile"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 bg-white z-[60] flex flex-col"
            >
              <FilterHeader
                onClose={onClose}
                onBack={() => {
                  setMobileActiveFilter(null);
                  setTempSelected({});
                  setTempPrice(null);
                }}
                activeFilter={mobileActiveFilter}
                variant="mobile"
              />

              <div className="flex-1 overflow-hidden">
                {mobileActiveFilter ? (
                  <FilterOptionsMobile
                    title={mobileActiveFilter}
                    mockFilters={mockFilters}
                    selected={tempSelected}
                    setSelected={setTempSelected}
                    price={tempPrice ?? priceRange}
                    setPrice={setTempPrice}
                  />
                ) : (
                  <FilterListMobile
                    mockFilters={mockFilters}
                    selected={selected}
                    setMobileActiveFilter={setMobileActiveFilter}
                    setTempSelected={setTempSelected}
                    setTempPrice={setTempPrice}
                    price={priceRange}
                  />
                )}
              </div>

              {/* Mobile chips (horizontal scrollable) */}
              {!mobileActiveFilter && hasFilters && (
                <FilterChipsMobile
                  selected={selected}
                  setSelected={setSelected}
                  price={priceRange}
                />
              )}

              {mobileActiveFilter ? (
                <div className="px-4 py-3 border-t border-[#EEF2F6]">
                  <Button
                    disabled={
                      !(
                        (tempSelected[mobileActiveFilter]?.length ?? 0) > 0 ||
                        (mobileActiveFilter === "Цена" &&
                          tempPrice &&
                          (tempPrice[0] > 0 || tempPrice[1] < 500000))
                      )
                    }
                    className="w-full py-7 text-sm font-normal uppercase"
                    onClick={() => {
                      setSelected(tempSelected);
                      if (mobileActiveFilter === "Цена" && tempPrice)
                        setPriceRange(tempPrice);
                      setMobileActiveFilter(null);
                      setTempSelected({});
                      setTempPrice(null);
                    }}
                  >
                    {(tempSelected[mobileActiveFilter]?.length ?? 0) > 0 ||
                    (mobileActiveFilter === "Цена" &&
                      tempPrice &&
                      (tempPrice[0] > 0 || tempPrice[1] < 500000))
                      ? `Применить (${tempSelected[mobileActiveFilter]?.length ?? 0})`
                      : "Применить"}
                  </Button>
                </div>
              ) : (
                <FilterFooter
                  hasFilters={hasFilters}
                  total={total}
                  onClear={clearAll}
                  onApply={applyFilters}
                  loading={loading}
                />
              )}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
