"use client";

import { useEffect, useState } from "react";
import { Category, getCategories } from "@/services/categories";
import { useLocale } from "next-intl";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getCategories(locale);
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Ошибка при загрузке категорий");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locale]);

  return { categories, loading, error };
}
