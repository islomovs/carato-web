/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RefObject, useState } from "react";
import FilterDrawer from "./FilterDrawer";
import FilterChipsDesktop from "../filter/FilterChipsDesktop";
import { INITIAL_FILTERS, SortOption } from "@/services/product";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

export interface Metal {
  id: number;
  name: string;
  fineness: number;
}
export interface Size {
  id: number;
  name: string;
}

interface Props {
  refBar: RefObject<HTMLDivElement | null>;
  total: number;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
  onUpdateFilters: (filters: Partial<typeof INITIAL_FILTERS>) => void;
  metals: Metal[];
  sizes: Size[];
  previewTotal: number | null;
  previewLoading: boolean;
  onPreviewFilters: (filters: Partial<typeof INITIAL_FILTERS>) => void;
  stickyTop?: string;
}

const SORT_VALUE_MAP: Record<string, SortOption> = {
  sortNewest: "CREATED_DESC",
  sortBestRated: "BEST_RATING_DESC",
  sortCheapest: "PRICE_ASC",
  sortMostExpensive: "PRICE_DESC",
};

export default function FilterBar({
  refBar,
  total,
  selectedFilters,
  setSelectedFilters,
  onUpdateFilters,
  sizes,
  metals,
  previewTotal,
  previewLoading,
  onPreviewFilters,
  stickyTop = "top-16",
}: Props) {
  const t = useTranslations("filters");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [weightRange, setWeightRange] = useState<[number, number]>([0.5, 100]);

  const hasFilters = Object.values(selectedFilters).some(
    (arr) => arr.length > 0,
  );

  const buildApiFilters = (
    uiFilters: Record<string, string[]>,
    currentPriceRange: [number, number] = priceRange,
    currentWeightRange: [number, number] = weightRange,
  ): Partial<typeof INITIAL_FILTERS> => {
    const api: Partial<typeof INITIAL_FILTERS> = {};

    const sortOptions = uiFilters[t("sort")];
    if (sortOptions?.length) {
      const entry = Object.entries(SORT_VALUE_MAP).find(
        ([key]) => t(key as any) === sortOptions[0],
      );
      if (entry) api.sortType = entry[1];
    }

    const metalOptions = uiFilters[t("metals")];
    if (metalOptions?.length) {
      const ids = metalOptions
        .map((name) => metals.find((m) => m.name === name)?.id)
        .filter(Boolean) as number[];
      if (ids.length) api.metals = ids;
    }

    const sizeOptions = uiFilters[t("sizes")];
    if (sizeOptions?.length) {
      const ids = sizeOptions
        .map((name) => sizes.find((s) => s.name === name)?.id)
        .filter(Boolean) as number[];
      if (ids.length) api.sizes = ids;
    }

    if (currentPriceRange[0] > 0) api.priceFrom = currentPriceRange[0];
    if (currentPriceRange[1] < 50000000) api.priceTo = currentPriceRange[1];
    if (currentWeightRange[0] > 0.5) api.weightFrom = currentWeightRange[0];
    if (currentWeightRange[1] < 100) api.weightTo = currentWeightRange[1];

    if (uiFilters[t("categories")]?.length)
      api.categorySlug = uiFilters[t("categories")][0];
    if (uiFilters[t("subcategories")]?.length)
      api.subcategorySlug = uiFilters[t("subcategories")][0];

    return api;
  };

  const handleRemove = (title: string, option: string) => {
    const updated = { ...selectedFilters };
    updated[title] = updated[title]?.filter((o) => o !== option);
    if (!updated[title]?.length) delete updated[title];
    setSelectedFilters(updated);

    if (title === t("weight")) {
      const reset: [number, number] = [0.5, 100];
      setWeightRange(reset);
      const base = buildApiFilters(updated, priceRange, reset);
      onUpdateFilters({ ...base, weightFrom: null, weightTo: null });
      return;
    }

    if (title === t("priceRange")) {
      const reset: [number, number] = [0, 50000000];
      setPriceRange(reset);
      const base = buildApiFilters(updated, reset, weightRange);
      onUpdateFilters({ ...base, priceFrom: null, priceTo: null });
      return;
    }

    onUpdateFilters(buildApiFilters(updated, priceRange, weightRange));
  };

  const handleClearAll = () => {
    const resetPrice: [number, number] = [0, 50000000];
    const resetWeight: [number, number] = [0.5, 100];
    setSelectedFilters({});
    setPriceRange(resetPrice);
    setWeightRange(resetWeight);
    onUpdateFilters(buildApiFilters({}, resetPrice, resetWeight));
  };

  return (
    <>
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        total={total}
        selected={selectedFilters}
        setSelected={setSelectedFilters}
        onUpdateFilters={onUpdateFilters}
        metals={metals}
        sizes={sizes}
        previewTotal={previewTotal}
        previewLoading={previewLoading}
        onPreviewFilters={onPreviewFilters}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        weightRange={weightRange}
        setWeightRange={setWeightRange}
      />

      <div
        ref={refBar}
        className={`sticky ${stickyTop} z-10 border-y border-[#EEF2F6] bg-white`}
      >
        <div className="w-full flex items-center justify-between px-4 md:px-8 py-[22px]">
          <Button
            onClick={() => setFilterOpen(true)}
            variant="outline"
            className="flex items-center gap-2 px-3 py-1.5 h-auto border-[#E3E8EE] cursor-pointer"
          >
            <Image
              src="/icons/settings.svg"
              alt="Settings"
              width={20}
              height={20}
            />
            <span className="text-[12px] font-normal uppercase">
              {t("filters")}
            </span>
          </Button>
          <div className="text-[14px] font-[300]">
            {total.toLocaleString("ru-RU")} {t("items")}
          </div>
        </div>

        {hasFilters && (
          <FilterChipsDesktop
            hasFilters={hasFilters}
            selectedFilters={selectedFilters}
            handleRemove={handleRemove}
            handleClearAll={handleClearAll}
          />
        )}
      </div>
    </>
  );
}
