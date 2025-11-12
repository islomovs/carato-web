"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { RefObject, useState } from "react";
import FilterDrawer from "./FilterDrawer";
import FilterChipsDesktop from "./filter/FilterChipsDesktop";

interface Props {
  refBar: RefObject<HTMLDivElement | null>;
  total: number;
}

export default function FilterBar({ refBar, total }: Props) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const hasFilters = Object.values(selectedFilters).some(
    (arr) => arr.length > 0
  );

  const handleRemove = (title: string, option: string) => {
    setSelectedFilters((prev) => {
      const newOptions = prev[title].filter((item) => item !== option);
      const updated = { ...prev, [title]: newOptions };
      if (newOptions.length === 0) delete updated[title];
      return updated;
    });
  };

  const handleClearAll = () => setSelectedFilters({});

  return (
    <>
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        total={total}
        selected={selectedFilters}
        setSelected={setSelectedFilters}
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

        {/* ✅ Filter chips section */}
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
