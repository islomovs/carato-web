"use client";

import { useEffect, useState } from "react";
import {
  CategoryCatalogue,
  getCategoryCatalogues,
  getCategoryCatalogueBySlug,
  CategoryCatalogueBySlug,
} from "@/services/category-catalogues";
import { useLocale } from "next-intl";

export function useCategoriesCatalogue() {
  const [catalogues, setCatalogues] = useState<CategoryCatalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getCategoryCatalogues(locale);
        setCatalogues(data);
      } catch (err) {
        console.error("Failed to load categories catalogues:", err);
        setError("Ошибка при загрузке каталогов категорий");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locale]);

  return { catalogues, loading, error };
}

export function useCategoryCatalogue(slug: string | null) {
  const [catalogue, setCatalogue] = useState<CategoryCatalogueBySlug | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        setLoading(true);
        const data = await getCategoryCatalogueBySlug(slug || "", locale);
        setCatalogue(data);
      } catch (err) {
        console.error("Failed to load catalogue:", err);
        setError("Ошибка при загрузке каталога");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug, locale]);

  return { catalogue, loading, error };
}
