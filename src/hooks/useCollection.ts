"use client";

import { useEffect, useState } from "react";
import { getCollections, Collection } from "@/services/collections";

export function useCollections(locale: string) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getCollections(locale);
        setCollections(data);
      } catch (err) {
        console.error("Failed to load collections:", err);
        setError("Ошибка при загрузке коллекций");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locale]);

  return { collections, loading, error };
}
