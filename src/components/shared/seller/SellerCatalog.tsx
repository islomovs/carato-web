"use client";

import React, { useRef, useState, useEffect } from "react";
import FilterBar from "@/components/shared/catalog/FilterBar";
import ProductGrid from "@/components/shared/catalog/ProductGrid";
import CatalogPagination from "@/components/shared/catalog/CatalogPagination";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useProducts } from "@/hooks/useProducts";
import { INITIAL_FILTERS } from "@/services/product";

const PAGE_SIZE = 20;

interface SellerCatalogProps {
  sellerSlug: string;
  active: boolean;
}

export default function SellerCatalog({
  sellerSlug,
  active,
}: SellerCatalogProps) {
  const t = useTranslations("seller");
  const refBar = useRef<HTMLDivElement | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const {
    products,
    page,
    setPage,
    totalPages,
    totalElements,
    loading,
    updateFilters,
    metals,
    sizes,
    previewTotal,
    previewLoading,
    previewFilters,
  } = useProducts(PAGE_SIZE, INITIAL_FILTERS);

  useEffect(() => {
    if (active && sellerSlug) {
      updateFilters({ seller: sellerSlug });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, sellerSlug]);

  const mobileProducts = products.slice(0, visibleCount);

  return (
    <div>
      <FilterBar
        refBar={refBar}
        total={totalElements}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        onUpdateFilters={updateFilters}
        metals={metals}
        sizes={sizes}
        previewTotal={previewTotal}
        previewLoading={previewLoading}
        onPreviewFilters={previewFilters}
      />

      <div className="w-full p-4 md:px-8 md:pt-8 mb-40">
        {/* Mobile — load more */}
        <div className="md:hidden">
          <ProductGrid products={mobileProducts} loading={loading} />
          {visibleCount < totalElements && (
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                onClick={() =>
                  setVisibleCount((p) => Math.min(p + PAGE_SIZE, totalElements))
                }
                className="w-[400px] max-w-full py-[8px] text-[12px] text-black border-black hover:bg-gray-50"
              >
                {t("loadMore", { count: totalElements - visibleCount })}
              </Button>
            </div>
          )}
        </div>

        {/* Desktop — pagination */}
        <div className="hidden md:block">
          <ProductGrid products={products} loading={loading} />
          {totalPages > 1 && (
            <CatalogPagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
