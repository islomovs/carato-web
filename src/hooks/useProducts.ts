/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { fetchAllProducts, INITIAL_FILTERS } from "@/services/product";
import { useLocale } from "use-intl";

export function useProducts(initialPageSize = 20, initialFilters?: any) {
  const [filters, setFilters] = useState(initialFilters || INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [size] = useState(initialPageSize);
  const locale = useLocale();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    if (loading) return;

    // Prevent request if no category or subcategory is selected
    if (!filters.categorySlug && !filters.subcategorySlug) {
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
        },
        locale
      );

      setData(response);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Reload when filters or page changes
  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  const updateFilters = (newFilters: Partial<typeof INITIAL_FILTERS>) => {
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
    setPage(1); // reset to page 1 when filters update
    console.log("Updated filters:", { ...filters, ...newFilters });
  };

  return {
    data,
    products: data?.products?.content ?? [],
    totalPages: data?.products?.totalPages ?? 1,
    totalElements: data?.products?.totalElements ?? 0,

    loading,
    error,

    page,
    setPage,

    filters,
    updateFilters,

    reload: loadProducts,
  };
}
