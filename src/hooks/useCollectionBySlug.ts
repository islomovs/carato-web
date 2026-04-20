"use client";

import { useState, useEffect } from "react";
import {
  CollectionDetail,
  getCollectionBySlug,
} from "@/services/collections";

export function useCollectionBySlug(slug: string, locale: string) {
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getCollectionBySlug(slug, locale)
      .then(setCollection)
      .catch(() => setError("Error loading collection"))
      .finally(() => setLoading(false));
  }, [slug, locale]);

  return { collection, loading, error };
}
