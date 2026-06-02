/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { fetchAllProducts, INITIAL_FILTERS } from "@/services/product";
import { useLocale } from "use-intl";

export function useProducts(
  initialPageSize = 20,
  initialFilters?: any,
  allowSearchOnly = false,
) {
  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
    ...initialFilters,
  });

  const [page, setPage] = useState(1);
  const [size] = useState(initialPageSize);
  const locale = useLocale();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previewTotal, setPreviewTotal] = useState<number | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const loadProducts = async () => {
    console.log("🟢 loadProducts called with filters:", filters);
    if (allowSearchOnly && !filters.search?.trim()) {
      return;
    }
    // Prevent request if no category or subcategory is selected
    if (
      !allowSearchOnly &&
      !filters.catalogueSlug &&
      !filters.categorySlug &&
      !filters.subcategorySlug &&
      !filters.seller
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchAllProducts(
        {
          page,
          size,
          search: filters.search || undefined,
          priceFrom: filters.priceFrom != null ? filters.priceFrom : undefined,
          priceTo: filters.priceTo != null ? filters.priceTo : undefined,
          weightFrom:
            filters.weightFrom != null ? filters.weightFrom : undefined,
          weightTo: filters.weightTo != null ? filters.weightTo : undefined,
          catalogueSlug: filters.catalogueSlug || undefined,
          categorySlug: filters.categorySlug || undefined,
          subcategorySlug: filters.subcategorySlug || undefined,
          metals: filters.metals?.length ? filters.metals : undefined,
          sizes: filters.sizes?.length ? filters.sizes : undefined,
          sortType: filters.sortType || undefined,
          seller: filters.seller != null ? filters.seller : undefined,
        },
        locale,
      );

      setData(response);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // useProducts.ts — separate preview from main filters completely
  const previewFilters = async (
    newFilters: Partial<typeof INITIAL_FILTERS>,
  ) => {
    setPreviewLoading(true);
    try {
      const merged = {
        ...INITIAL_FILTERS,
        catalogueSlug: filters.catalogueSlug,
        categorySlug: filters.categorySlug,
        subcategorySlug: filters.subcategorySlug,
        seller: filters.seller,
        ...newFilters,
      };
      // Most-specific scope wins for preview
      const scopeParams = merged.subcategorySlug
        ? { subcategorySlug: merged.subcategorySlug || undefined }
        : merged.categorySlug
        ? { categorySlug: merged.categorySlug || undefined }
        : { catalogueSlug: merged.catalogueSlug || undefined };
      const response = await fetchAllProducts(
        {
          page: 1,
          size: 1,
          ...scopeParams,
          priceFrom: merged.priceFrom != null ? merged.priceFrom : undefined,
          priceTo: merged.priceTo != null ? merged.priceTo : undefined,
          weightFrom: merged.weightFrom != null ? merged.weightFrom : undefined,
          weightTo: merged.weightTo != null ? merged.weightTo : undefined,
          metals: merged.metals?.length ? merged.metals : undefined,
          sizes: merged.sizes?.length ? merged.sizes : undefined,
          sortType: merged.sortType || undefined,
          seller: merged.seller != null ? merged.seller : undefined,
        },
        locale,
      );
      setPreviewTotal(response?.products?.totalElements ?? null);
    } catch {
      setPreviewTotal(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filtersKey]);

  const updateFilters = (newFilters: Partial<typeof INITIAL_FILTERS>) => {
    setFilters((prev: any) => {
      // Preserve slug scope from URL unless newFilters explicitly sets a more-specific scope
      const hasNewSubcategory = "subcategorySlug" in newFilters;
      const hasNewCategory = "categorySlug" in newFilters;
      const hasNewCatalogue = "catalogueSlug" in newFilters;

      const next = {
        ...INITIAL_FILTERS,
        // Preserve catalogue unless overridden or a more-specific scope is set
        catalogueSlug:
          hasNewSubcategory || hasNewCategory || hasNewCatalogue
            ? undefined
            : prev.catalogueSlug,
        categorySlug:
          hasNewSubcategory || hasNewCategory
            ? undefined
            : prev.categorySlug,
        subcategorySlug: hasNewSubcategory ? undefined : prev.subcategorySlug,
        seller: prev.seller,
        // Preserve sortType only if newFilters doesn't explicitly pass it
        ...("sortType" in newFilters ? {} : { sortType: prev.sortType }),
        ...newFilters,
      };
      const equal = JSON.stringify(prev) === JSON.stringify(next);
      return equal ? prev : next;
    });
    setPage(1);
  };

  return {
    data,
    products: data?.products?.content ?? [],
    totalPages: data?.products?.totalPages ?? 1,
    totalElements: data?.products?.totalElements ?? 0,
    metals: data?.filters?.metals ?? [],
    sizes: data?.filters?.sizes ?? [],
    loading,
    error,

    page,
    setPage,

    filters,
    updateFilters,

    reload: loadProducts,

    previewTotal,
    previewLoading,
    previewFilters,
  };
}
