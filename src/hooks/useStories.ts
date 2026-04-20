"use client";

import { useEffect, useState } from "react";
import { getStories, Story } from "@/services/stories";

export function useStories(locale: string) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchStories() {
      try {
        setLoading(true);
        const data = await getStories(locale);
        if (mounted) setStories(data);
      } catch (err) {
        console.error("Failed to fetch stories:", err);
        if (mounted) setError("Failed to load stories.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchStories();

    return () => {
      mounted = false;
    };
  }, [locale]);

  return { stories, loading, error };
}
