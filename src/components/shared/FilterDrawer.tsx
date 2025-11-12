"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterHeader from "./filter/FilterHeader";
import FilterAccordion from "./filter/FilterAccordion";
import FilterFooter from "./filter/FilterFooter";
import FilterListMobile from "./filter/FilterListMobile";
import FilterOptionsMobile from "./filter/FilterOptionsMobile";
import FilterChipsMobile from "./filter/FilterChipsMobile";
import { Button } from "../ui/button";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  total: number;
  selected: Record<string, string[]>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

type FilterOption = {
  title: string;
  options: string[];
};

const mockFilters: FilterOption[] = [
  {
    title: "Материал",
    options: [
      "Золото",
      "Серебро",
      "Платина",
      "Вольфрам",
      "Керамика",
      "Дерево",
      "Углепластик",
      "Палладий",
      "Медь",
      "Бронза",
      "Латунь",
      "Нержавеющая сталь",
      "Цирконий",
      "Тантал",
      "Олово",
      "Железо",
      "Алюминий",
      "Бериллий",
      "Ванадий",
      "Кобальт",
      "Никель",
      "Титанит",
    ],
  },
  {
    title: "Коллекция",
    options: ["Classic", "Premium", "Limited Edition"],
  },
  {
    title: "Цена",
    options: [], // special
  },
];

export default function FilterDrawer({
  open,
  onClose,
  total,
  selected,
  setSelected,
}: FilterDrawerProps) {
  // Expanded accordion for desktop
  const [expanded, setExpanded] = useState<string | null>(null);

  // Price values (always local here, and sync to selected via setSelected)
  const [price, setPrice] = useState<[number, number]>([0, 500000]);

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
      const priceApplied = price[0] > 0 || price[1] < 500000;
      if (!priceApplied) {
        if (!prev["Цена"]) return prev;
        const copy = { ...prev };
        delete copy["Цена"];
        return copy;
      } else {
        const copy = { ...prev, Цена: [`${price[0]}-${price[1]}`] };
        return copy;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  // applied count helper
  const appliedCount = (title: string) => selected[title]?.length || 0;

  const hasFilters =
    Object.values(selected).some((a) => a && a.length > 0) ||
    price[0] > 0 ||
    price[1] < 500000;

  // Clear all
  const clearAll = () => {
    setSelected({});
    setPrice([0, 500000]);
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
                    price={price}
                    setPrice={setPrice}
                    appliedCount={appliedCount}
                  />
                ))}
              </div>

              {/* Footer: Clear + Show results */}
              <FilterFooter
                hasFilters={hasFilters}
                total={total}
                onClear={clearAll}
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
                    price={tempPrice ?? price}
                    setPrice={setTempPrice}
                  />
                ) : (
                  <FilterListMobile
                    mockFilters={mockFilters}
                    selected={selected}
                    setMobileActiveFilter={setMobileActiveFilter}
                    setTempSelected={setTempSelected}
                    setTempPrice={setTempPrice}
                    price={price}
                  />
                )}
              </div>

              {/* Mobile chips (horizontal scrollable) */}
              {!mobileActiveFilter && hasFilters && (
                <FilterChipsMobile
                  selected={selected}
                  setSelected={setSelected}
                  price={price}
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
                        setPrice(tempPrice);
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
                />
              )}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
