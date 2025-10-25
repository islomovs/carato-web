"use client";

import { useEffect, useState } from "react";
import { getNews, NewsItem } from "@/services/news";

export function useNews(locale: string, page = 1, size = 6) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const data = await getNews(locale, page, size);
        setNews(data);
      } catch (err) {
        setError("Failed to load news");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [locale, page, size]);

  return { news, loading, error };
}
