"use client";

import React, { useMemo, useRef, useState } from "react";
import { Product } from "@/components/shared/ProductCard";
import CatalogHeader from "../shared/CatalogHeader";
import FilterBar from "../shared/FilterBar";
import ProductGrid from "../shared/ProductGrid";
import CatalogPagination from "../shared/CatalogPagination";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useSticky } from "@/hooks/useSticky";

const PAGE_SIZE = 20;

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const sampleProducts: Product[] = useMemo(
    () =>
      Array.from({ length: 123 }).map((_, i) => ({
        id: i + 1,
        title: `Пример товара ${i + 1}`,
        price: Math.round(i * 90000),
        image: `/images/product-placeholder.png`,
        description: "Описание продукта",
      })),
    []
  );

  const [page, setPage] = useState(1);
  const total = sampleProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const startIndex = (page - 1) * PAGE_SIZE;
  const pageProducts = sampleProducts.slice(startIndex, startIndex + PAGE_SIZE);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleProducts = sampleProducts.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, total));
  };

  const refTitle = useRef<HTMLDivElement | null>(null);
  const refBar = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full">
      <CatalogHeader refTitle={refTitle} />
      <FilterBar refBar={refBar} total={total} />

      <div className="w-full p-4 md:px-8 md:pt-8 items-center mb-40">
        {/* Mobile view — incremental load */}
        <div className="md:hidden">
          <ProductGrid products={visibleProducts} />

          {visibleCount < total && (
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                onClick={handleShowMore}
                className="w-[400px] max-w-full py-[8px] text-[12px] text-black border-black hover:bg-gray-50"
              >
                {t("loadMore", { count: total - visibleCount })}
              </Button>
            </div>
          )}
        </div>

        {/* Desktop view — pagination */}
        <div className="hidden md:block">
          <ProductGrid products={pageProducts} />
          <CatalogPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
