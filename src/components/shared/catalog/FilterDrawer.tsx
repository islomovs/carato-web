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
import { INITIAL_FILTERS, SortOption } from "@/services/product";
import { useTranslations } from "next-intl";
import { Metal, Size } from "./FilterBar";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  total: number;
  selected: Record<string, string[]>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  onUpdateFilters: (filters: Partial<typeof INITIAL_FILTERS>) => void;
  metals: Metal[];
  sizes: Size[];
  previewTotal: number | null;
  previewLoading: boolean;
  onPreviewFilters: (filters: Partial<typeof INITIAL_FILTERS>) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  weightRange: [number, number];
  setWeightRange: (v: [number, number]) => void;
}

type FilterOption = {
  title: string;
  options: string[];
};

export default function FilterDrawer({
  open,
  onClose,
  total,
  selected,
  setSelected,
  onUpdateFilters,
  metals,
  sizes,
  previewTotal,
  previewLoading,
  onPreviewFilters,
  priceRange,
  setPriceRange,
  weightRange,
  setWeightRange,
}: FilterDrawerProps) {
  const t = useTranslations("filters");

  // Replace SORT_OPTIONS (labels now use translation keys):
  const SORT_OPTIONS: { labelKey: string; value: SortOption }[] = [
    { labelKey: "sortNewest", value: "CREATED_DESC" },
    { labelKey: "sortBestRated", value: "BEST_RATING_DESC" },
    { labelKey: "sortCheapest", value: "PRICE_ASC" },
    { labelKey: "sortMostExpensive", value: "PRICE_DESC" },
  ];

  // Replace mockFilters (titles now translatable strings):
  const mockFilters: FilterOption[] = [
    { title: t("sort"), options: SORT_OPTIONS.map((o) => t(o.labelKey)) },
    { title: t("metals"), options: metals.map((m) => m.name) },
    { title: t("priceRange"), options: [] },
    { title: t("weight"), options: [] },
    { title: t("sizes"), options: sizes.map((s) => s.name) },
    { title: t("categories"), options: [] },
    { title: t("subcategories"), options: [] },
  ];

  const filterTypeMap: Record<string, "price" | "weight" | "sort" | "metal"> = {
    [t("priceRange")]: "price",
    [t("weight")]: "weight",
    [t("sort")]: "sort",
    [t("metals")]: "metal",
  };

  const [sortBy, setSortBy] = useState<SortOption | null>(null);

  // Expanded accordion for desktop
  const [expanded, setExpanded] = useState<string | null>(null);

  // isMobile determined at runtime (client)
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Mobile: which filter is drilled-in (null -> main list)
  const [mobileActiveFilter, setMobileActiveFilter] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!open) return;
    const snapshot = buildPreviewFilters();
    const timer = setTimeout(() => {
      onPreviewFilters(snapshot);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, priceRange, weightRange, sortBy, JSON.stringify(selected)]);

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

  const appliedCount = (title: string) => {
    if (title === t("priceRange"))
      return priceRange[0] > 0 || priceRange[1] < 50000000 ? 1 : 0;
    if (title === t("weight"))
      return weightRange[0] > 0.5 || weightRange[1] < 100 ? 1 : 0;
    if (title === t("sort")) return selected[t("sort")]?.length ? 1 : 0;
    return selected[title]?.length || 0;
  };

  const hasFilters =
    Object.values(selected).some((a) => a && a.length > 0) ||
    priceRange[0] > 0 ||
    priceRange[1] < 50000000 ||
    weightRange[0] > 0.5 ||
    weightRange[1] < 100;

  const clearAll = () => {
    setSelected({});
    setPriceRange([0, 50000000]);
    setWeightRange([0.5, 100]);
    setSortBy(null);
    onUpdateFilters({});
    toast.success(t("filtersCleared"));
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
    {},
  );
  const [tempPrice, setTempPrice] = useState<[number, number] | null>(null);

  const applyFilters = () => {
    const apiFilters: Partial<typeof INITIAL_FILTERS> = {};

    if (priceRange[0] > 0) apiFilters.priceFrom = priceRange[0];
    if (priceRange[1] < 50000000) apiFilters.priceTo = priceRange[1];
    if (weightRange[0] > 0.5) apiFilters.weightFrom = weightRange[0];
    if (weightRange[1] < 100) apiFilters.weightTo = weightRange[1];
    if (sortBy) apiFilters.sortType = sortBy;

    if (selected[t("metals")]?.length) {
      const ids = selected[t("metals")]
        .map((name) => metals.find((m) => m.name === name)?.id)
        .filter(Boolean) as number[];
      if (ids.length) apiFilters.metals = ids;
    }

    if (selected[t("sizes")]?.length) {
      const ids = selected[t("sizes")]
        .map((name) => sizes.find((s) => s.name === name)?.id)
        .filter(Boolean) as number[];
      if (ids.length) apiFilters.sizes = ids;
    }

    // Write range chips into selected at apply time — not reactively
    setSelected((prev) => {
      const copy = { ...prev };
      const priceApplied = priceRange[0] > 0 || priceRange[1] < 50000000;
      if (priceApplied) {
        copy[t("priceRange")] = [`${priceRange[0]}-${priceRange[1]}`];
      } else {
        delete copy[t("priceRange")];
      }
      const weightApplied = weightRange[0] > 0.5 || weightRange[1] < 100;
      if (weightApplied) {
        copy[t("weight")] = [`${weightRange[0]}-${weightRange[1]}`];
      } else {
        delete copy[t("weight")];
      }
      return copy;
    });

    onUpdateFilters(apiFilters);
    onClose();
  };

  // Helper to build preview payload — same logic as applyFilters but doesn't close:
  const buildPreviewFilters = (): Partial<typeof INITIAL_FILTERS> => {
    const f: Partial<typeof INITIAL_FILTERS> = {};
    if (priceRange[0] > 0) f.priceFrom = priceRange[0];
    if (priceRange[1] > 0) f.priceTo = priceRange[1];
    if (weightRange[0] > 0.5) f.weightFrom = weightRange[0];
    if (weightRange[1] < 100) f.weightTo = weightRange[1];
    if (sortBy) f.sortType = sortBy;
    if (selected[t("metals")]?.length) {
      const ids = selected[t("metals")]
        .map((name) => metals.find((m) => m.name === name)?.id)
        .filter(Boolean) as number[];
      if (ids.length) f.metals = ids;
    }
    if (selected[t("sizes")]?.length) {
      const ids = selected[t("sizes")]
        .map((name) => sizes.find((s) => s.name === name)?.id)
        .filter(Boolean) as number[];
      if (ids.length) f.sizes = ids;
    }
    return f;
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
                    filterType={filterTypeMap[filter.title] ?? "other"}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    isSingleSelect={filter.title === t("sort")}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    weightRange={weightRange}
                    setWeightRange={setWeightRange}
                    isOptionActive={(title, option) => {
                      if (title === t("sort")) {
                        return selected[t("sort")]?.[0] === option;
                      }
                      return isOptionActive(title, option);
                    }}
                    toggleOption={(title, option) => {
                      if (title === t("sort")) {
                        const match = SORT_OPTIONS.find(
                          (o) => t(o.labelKey) === option,
                        );
                        if (!match) return;

                        const newSortBy =
                          sortBy === match.value ? null : match.value;
                        setSortBy(newSortBy);

                        // Write into selected so chips appear
                        setSelected((prev) => {
                          const copy = { ...prev };
                          if (newSortBy) {
                            copy[t("sort")] = [option]; // store the translated label as the chip
                          } else {
                            delete copy[t("sort")];
                          }
                          return copy;
                        });
                        return;
                      }
                      toggleOption(title, option);
                    }}
                    appliedCount={(title) => {
                      if (title === t("sort"))
                        return selected[t("sort")]?.length ? 1 : 0;
                      return appliedCount(title);
                    }}
                  />
                ))}
              </div>

              {/* Footer: Clear + Show results */}
              <FilterFooter
                hasFilters={hasFilters}
                total={previewTotal ?? total}
                onClear={clearAll}
                onApply={applyFilters}
                loading={previewLoading}
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
                        (mobileActiveFilter === t("priceRange") &&
                          tempPrice &&
                          (tempPrice[0] > 0 || tempPrice[1] < 500000))
                      )
                    }
                    className="w-full py-7 text-sm font-normal uppercase"
                    onClick={() => {
                      setSelected(tempSelected);
                      if (mobileActiveFilter === t("priceRange") && tempPrice)
                        setPriceRange(tempPrice);
                      setMobileActiveFilter(null);
                      setTempSelected({});
                      setTempPrice(null);
                    }}
                  >
                    {(tempSelected[mobileActiveFilter]?.length ?? 0) > 0 ||
                    (mobileActiveFilter === t("priceRange") &&
                      tempPrice &&
                      (tempPrice[0] > 0 || tempPrice[1] < 500000))
                      ? `${t("apply")} (${tempSelected[mobileActiveFilter]?.length ?? 0})`
                      : `${t("apply")}`}
                  </Button>
                </div>
              ) : (
                <FilterFooter
                  hasFilters={hasFilters}
                  total={previewTotal ?? total}
                  onClear={clearAll}
                  onApply={applyFilters}
                  loading={previewLoading}
                />
              )}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
