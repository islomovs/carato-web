/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { getNews, NewsItem, getNewsBySlug } from "@/services/news";
import { useTranslations, useLocale } from "next-intl";

export function useNews({
  slug,
}: {
  page?: number;
  size?: number;
  slug?: string;
}) {
  const t = useTranslations("news");
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [singleNews, setSingleNews] = useState<NewsItem | null>(null);
  const [newsLoading, setNewsLoading] = useState(true);
  const [singleLoading, setSingleLoading] = useState(false);

  const loading = newsLoading || singleLoading;

  const fetchAllNews = async () => {
    try {
      setNewsLoading(true);
      const data = await getNews(locale, 1, 100);
      setNews(data);
    } catch (err) {
      setError(t("failedToLoadNews"));
    } finally {
      setNewsLoading(false);
    }
  };

  const fetchSingleNews = async (slug: string) => {
    try {
      setSingleLoading(true);
      const data = await getNewsBySlug(slug, locale);
      setSingleNews(data);
    } catch (err) {
      setError(t("failedToLoadNews"));
    } finally {
      setSingleLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews(); // always fetch all news
    if (slug) {
      fetchSingleNews(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return { news, singleNews, loading, error };
}
