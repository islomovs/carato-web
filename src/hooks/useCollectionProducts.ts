"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CollectionBannerProduct,
  getCollectionProducts,
} from "@/services/collections";

const PAGE_SIZE = 20;

export function useCollectionProducts(slug: string, locale: string) {
  const [products, setProducts] = useState<CollectionBannerProduct[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPage = useCallback(
    async (p: number) => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getCollectionProducts(slug, p, PAGE_SIZE, locale);
        setProducts(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotalElements(data.totalElements ?? 0);
        setPage(p);
      } catch {
        // silently fail – products stay empty
      } finally {
        setLoading(false);
      }
    },
    [slug, locale]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return {
    products,
    page,
    setPage: fetchPage,
    totalPages,
    totalElements,
    loading,
    PAGE_SIZE,
  };
}
