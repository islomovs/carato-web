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

  const previewFilters = async (
    newFilters: Partial<typeof INITIAL_FILTERS>,
  ) => {
    setPreviewLoading(true);
    try {
      const response = await fetchAllProducts(
        {
          page: 1,
          size: 1, // we only need totalElements, not actual products
          ...filters,
          ...newFilters,
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

  const loadProducts = async () => {
    if (allowSearchOnly && !filters.search?.trim()) {
      return;
    }
    // Prevent request if no category or subcategory is selected
    if (!allowSearchOnly && !filters.categorySlug && !filters.subcategorySlug) {
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
          priceFrom: filters.priceFrom || undefined,
          priceTo: filters.priceTo || undefined,
          weightFrom: filters.weightFrom || undefined,
          weightTo: filters.weightTo || undefined,
          categorySlug: filters.categorySlug || undefined,
          subcategorySlug: filters.subcategorySlug || undefined,
          metals: filters.metals.length ? filters.metals : undefined,
          sizes: filters.sizes.length ? filters.sizes : undefined,
          sortType: filters.sortType || undefined,
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

  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filtersKey]);

  const updateFilters = (newFilters: Partial<typeof INITIAL_FILTERS>) => {
    setFilters((prev: any) => {
      const next = { ...prev, ...newFilters };
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
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
