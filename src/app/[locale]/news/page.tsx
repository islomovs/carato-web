"use client";

import { useRef, useState, useEffect } from "react";
import CatalogHeader from "@/components/shared/catalog/CatalogHeader";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useNews } from "@/hooks/useNews";
import CatalogPagination from "@/components/shared/catalog/CatalogPagination";
import { NewsItem } from "@/services/news";
import NewsCard from "@/components/shared/NewsCard";
import NewsSkeleton from "@/components/shared/NewsSkeleton";

const PAGE_SIZE = 10;

export default function NewsPage() {
  const t = useTranslations("news");
  const refTitle = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(1);
  const { news, loading, error } = useNews({ page, size: PAGE_SIZE });

  const [allNews, setAllNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (!news) return;

    if (page === 1) {
      setAllNews(news);
    } else {
      setAllNews((prev) => [...prev, ...news]);
    }
  }, [news, page]);

  const hasNextPage = news.length === PAGE_SIZE;
  const totalPages = hasNextPage ? page + 1 : page;

  if (error) {
    return <div className="text-center text-red-500 py-20">{error}</div>;
  }

  return (
    <div className="w-full md:px-8">
      {/* Header */}
      <CatalogHeader refTitle={refTitle} title="News" />

      {/* News list */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-5 w-full">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <NewsSkeleton key={i} />
            ))
          : allNews.map((item) => <NewsCard key={item.id} item={item} />)}
      </div>

      {/* Mobile — Load More */}
      <div className="md:hidden">
        {!loading && news?.length === PAGE_SIZE && (
          <div className="px-4 mt-6 mb-20">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => prev + 1)}
              className="w-full h-[36px] text-sm uppercase font-normal rounded-md bg-white text-black border border-black hover:bg-black hover:!text-white transition-colors"
            >
              {t("loadMore")}
            </Button>
          </div>
        )}
      </div>

      {/* Desktop — Pagination */}
      {allNews.length > PAGE_SIZE && (
        <CatalogPagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
    </div>
  );
}
