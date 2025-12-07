"use client";

import { useEffect, useState } from "react";
import { getNews, NewsItem, getNewsBySlug } from "@/services/news";
import { useTranslations, useLocale } from "next-intl";

export function useNews(page = 1, size = 6) {
  const t = useTranslations("news");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNews(locale, page, size);
      setNews(data);
    } catch (err) {
      setError(t("failedToLoadNews"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const getBySlug = async (slug: string) => {
    try {
      setLoading(true);
      const data = await getNewsBySlug(slug, locale);
      setNews([data]);
    } catch (err) {
      setError(t("failedToLoadNews"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { news, loading, error, fetchNews, getBySlug };
}
