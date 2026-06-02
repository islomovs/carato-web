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
import { resolveSlugType } from "@/lib/slugResolver";
import {
  useAllCataloguesFull,
  useCategoriesCatalogue,
} from "@/hooks/useCategoriesCatalogue";

const PAGE_SIZE = 20;

interface CatalogPageProps {
  slug?: string | null;
}

export default function CatalogPage({ slug }: CatalogPageProps) {
  const t = useTranslations("catalog");
  const tFilters = useTranslations("filters");
  const { catalogues, loading: catLoading } = useCategoriesCatalogue();
  const resolved =
    !catLoading && slug ? resolveSlugType(slug, catalogues) : null;

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

  const { fullCatalogues, loading: fullLoading } = useAllCataloguesFull();

  const refTitle = useRef<HTMLDivElement | null>(null);
  const refBar = useRef<HTMLDivElement | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    if (!resolved) return;
    updateFilters({ [resolved.type]: resolved.value });
  }, [resolved?.type, resolved?.value]);

  // Pre-populate filter chips from the URL slug once the full catalogue tree loads
  useEffect(() => {
    if (!resolved || fullLoading || !fullCatalogues.length) return;

    if (resolved.type === "catalogueSlug") {
      const catalogue = fullCatalogues.find((c) => c.slug === resolved.value);
      if (catalogue) {
        setSelectedFilters({ [tFilters("catalogue")]: [catalogue.name] });
      }
      return;
    }

    for (const catalogue of fullCatalogues) {
      if (resolved.type === "categorySlug") {
        for (const cat of catalogue.categories ?? []) {
          if (cat.slug === resolved.value) {
            setSelectedFilters({
              [tFilters("catalogue")]: [catalogue.name],
              [tFilters("categories")]: [cat.name],
            });
            return;
          }
        }
      }
      if (resolved.type === "subcategorySlug") {
        for (const cat of catalogue.categories ?? []) {
          for (const sub of cat.subcategories ?? []) {
            if (sub.slug === resolved.value) {
              setSelectedFilters({
                [tFilters("catalogue")]: [catalogue.name],
                [tFilters("categories")]: [cat.name],
                [tFilters("subcategories")]: [sub.name],
              });
              return;
            }
          }
        }
      }
    }
  }, [resolved?.type, resolved?.value, fullLoading, fullCatalogues.length]);

  const productsReady = !slug || (!catLoading && resolved);
  const displayedProducts = productsReady ? products : [];
  const isLoading = loading || !productsReady;

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const mobileProducts = products.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, totalElements));
  };

  const label = (() => {
    if (!slug) return undefined;
    for (const cat of fullCatalogues) {
      if (cat.slug === slug) return cat.name;
      for (const c of cat.categories ?? []) {
        if (c.slug === slug) return c.name;
        for (const s of c.subcategories ?? []) {
          if (s.slug === slug) return s.name;
        }
      }
    }
    return undefined; // return undefined instead of slug while loading
  })();

  return (
    <div className="w-full pt-16 md:mt-0">
      <CatalogHeader
        refTitle={refTitle}
        title={fullLoading ? undefined : label}
      />{" "}
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
          fullCatalogues={fullCatalogues}
        />
      )}
      <div className="w-full p-4 md:px-8 md:pt-8 items-center mb-40">
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
