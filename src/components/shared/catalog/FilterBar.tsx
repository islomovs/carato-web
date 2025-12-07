"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { RefObject, useState } from "react";
import FilterDrawer from "./FilterDrawer";
import FilterChipsDesktop from "../filter/FilterChipsDesktop";
import { INITIAL_FILTERS } from "@/services/product";

interface Props {
  refBar: RefObject<HTMLDivElement | null>;
  total: number;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  onUpdateFilters: (filters: Partial<typeof INITIAL_FILTERS>) => void;
}

export default function FilterBar({
  refBar,
  total,
  selectedFilters,
  setSelectedFilters,
  onUpdateFilters,
}: Props) {
  const [filterOpen, setFilterOpen] = useState(false);

  const hasFilters = Object.values(selectedFilters).some(
    (arr) => arr.length > 0
  );

  const mapUIToAPI = (uiFilters: Record<string, string[]>) => ({
    categorySlug: uiFilters["Категория"]?.[0] || "",
    subcategorySlug: uiFilters["Подкатегория"]?.[0] || "",
    // add other filters here if needed
  });

  const handleRemove = (title: string, option: string) => {
    const updatedSelectedFilters = { ...selectedFilters };
    updatedSelectedFilters[title] = updatedSelectedFilters[title]?.filter(
      (o) => o !== option
    );
    if (!updatedSelectedFilters[title]?.length)
      delete updatedSelectedFilters[title];

    setSelectedFilters(updatedSelectedFilters);

    // Send full mapped filters for API
    const mappedFilters = mapUIToAPI(updatedSelectedFilters);
    console.log("Sending filters to API:", mappedFilters);
    onUpdateFilters(mappedFilters);
  };

  const handleClearAll = () => {
    const cleared: Record<string, string[]> = {};
    setSelectedFilters(cleared);
    console.log("Clearing all filters");
    const mappedFilters = mapUIToAPI(cleared);
    console.log("Sending filters to API:", mappedFilters);
    onUpdateFilters(mappedFilters);
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
      />

      <div
        ref={refBar}
        className="sticky top-16 z-40 border-t border-[#EEF2F6] bg-white"
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
            <span className="text-[12px] font-normal uppercase">ФИЛЬТРЫ</span>
          </Button>
          <div className="text-[14px] font-[300]">
            {total.toLocaleString("ru-RU")} ИЗДЕЛИЙ
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
