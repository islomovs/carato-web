/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useRef, useState, useEffect } from "react";
import CatalogHeader from "../shared/catalog/CatalogHeader";
import FilterBar from "../shared/catalog/FilterBar";
import ProductGrid from "../shared/catalog/ProductGrid";
import CatalogPagination from "../shared/catalog/CatalogPagination";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useProducts } from "@/hooks/useProducts";
import { INITIAL_FILTERS } from "@/services/product";
import { useCategories } from "@/hooks/useCategories";
import { resolveSlugType } from "@/lib/slugResolver";

const PAGE_SIZE = 20;

interface CatalogPageProps {
  slug?: string | null;
}

export default function CatalogPage({ slug }: CatalogPageProps) {
  const t = useTranslations("catalog");

  const { categories, loading: catLoading } = useCategories();

  const resolved =
    !catLoading && slug ? resolveSlugType(slug, categories) : null;

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
    if (!resolved) return;

    updateFilters({
      [resolved.type]: resolved.value,
    });
  }, [resolved?.type, resolved?.value]);

  const productsReady = !slug || (!catLoading && resolved);
  const displayedProducts = productsReady ? products : [];
  const isLoading = loading || !productsReady;

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const mobileProducts = products.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, totalElements));
  };

  const refTitle = useRef<HTMLDivElement | null>(null);
  const refBar = useRef<HTMLDivElement | null>(null);

  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  return (
    <div className="w-full">
      <CatalogHeader refTitle={refTitle} title={resolved?.label} />
      {catLoading || !resolved ? (
        <div className="w-full h-[48px] bg-gray-100 rounded-md animate-pulse mb-4" />
      ) : (
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
      )}
      <div className="w-full p-4 md:px-8 md:pt-8 items-center mb-40">
        {/* Mobile view — Load More */}
        <div className="md:hidden">
          <ProductGrid products={mobileProducts} loading={loading} />

          {visibleCount < totalElements && (
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                onClick={handleShowMore}
                className="w-[400px] max-w-full py-[8px] text-[12px] text-black border-black hover:bg-gray-50"
              >
                {t("loadMore", { count: totalElements - visibleCount })}
              </Button>
            </div>
          )}
        </div>

        {/* Desktop view — Pagination */}
        <div className="hidden md:block">
          <ProductGrid products={displayedProducts} loading={isLoading} />
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
