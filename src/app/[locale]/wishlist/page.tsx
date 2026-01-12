"use client";

import ProductGrid from "@/components/shared/catalog/ProductGrid";
import { useTranslations } from "next-intl";
import { useWishlistStore } from "@/lib/wishlistStore";
import CatalogPagination from "@/components/shared/catalog/CatalogPagination";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EmptyWishlist } from "@/components/shared/EmptyWishlist";

export default function WishlistPage() {
  const t = useTranslations("wishlist");

  const { items: wishlist, loading } = useWishlistStore();

  const products = wishlist.map((item) => item);
  const totalElements = products.length;
  const totalPages = Math.ceil(totalElements / 20);
  const [page, setPage] = useState(1);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, totalElements));
  };
  const PAGE_SIZE = 20;

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const mobileProducts = products.slice(0, visibleCount);
  const isEmpty = products.length === 0;

  return (
    <>
      <div className="px-4 md:px-8 w-full">
        <header className="w-full">
          <div
            className={`flex items-center justify-start mt-[102px] md:mt-[52px] ${isEmpty && "mb-8"}`}
          >
            <h1 className="text-[28px] leading-10 font-normal">{t("title")}</h1>
          </div>
        </header>
        {isEmpty && !loading ? (
          <EmptyWishlist />
        ) : (
          <div className="w-full pt-6 md:pt-8 items-center mb-40">
            {/* Mobile view — Load More */}
            <div className="md:hidden">
              <ProductGrid products={mobileProducts} loading={loading} />

              {visibleCount < totalElements && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    onClick={handleShowMore}
                    className="w-[400px] max-w-full py-[8px] text-[12px] text-black border-black hover:bg-gray-50"
                  >
                    {t("loadMore", { count: totalElements - visibleCount })}
                  </Button>
                </div>
              )}
            </div>

            {/* Desktop view — Pagination */}
            <div className="hidden md:block">
              <ProductGrid products={products} loading={loading} />
              {totalPages > 1 && (
                <CatalogPagination
                  page={page}
                  totalPages={totalPages}
                  setPage={setPage}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
