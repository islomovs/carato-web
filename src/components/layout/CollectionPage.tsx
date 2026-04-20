"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import CollectionHero from "@/components/shared/collection/CollectionHero";
import CollectionProductGrid from "@/components/shared/collection/CollectionProductGrid";
import CollectionBannerPanel from "@/components/shared/collection/CollectionBannerPanel";
import FilterBar from "@/components/shared/catalog/FilterBar";
import CatalogPagination from "@/components/shared/catalog/CatalogPagination";
import { Button } from "@/components/ui/button";
import { useCollectionBySlug } from "@/hooks/useCollectionBySlug";
import { useCollectionProducts } from "@/hooks/useCollectionProducts";
import { CollectionBanner } from "@/services/collections";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 20;

interface CollectionPageProps {
  slug: string;
}

export default function CollectionPage({ slug }: CollectionPageProps) {
  const t = useTranslations("collection");
  const locale = useLocale();

  const { collection, loading: heroLoading } = useCollectionBySlug(
    slug,
    locale,
  );
  const {
    products,
    page,
    setPage,
    totalPages,
    totalElements,
    loading: productsLoading,
  } = useCollectionProducts(slug, locale);

  const refBar = useRef<HTMLDivElement | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [activeBanner, setActiveBanner] = useState<CollectionBanner | null>(
    null,
  );

  // Mobile "load more" — we accumulate products client-side for now
  const [mobileExtra, setMobileExtra] = useState<typeof products>([]);
  const mobileAll = [...products, ...mobileExtra];
  const mobileHasMore = mobileAll.length < totalElements;

  const handleMobileLoadMore = async () => {
    const nextPage = Math.floor(mobileAll.length / PAGE_SIZE) + 1;
    // We'll fetch via the hook's setPage, but we need accumulated products.
    // For simplicity, call setPage which replaces products.
    // To accumulate on mobile, we track extra here via a separate call.
    try {
      const { getCollectionProducts } = await import("@/services/collections");
      const data = await getCollectionProducts(
        slug,
        nextPage,
        PAGE_SIZE,
        locale,
      );
      setMobileExtra((prev) => [...prev, ...(data.content ?? [])]);
    } catch {
      // silently fail
    }
  };

  const banners = collection?.banners ?? [];

  return (
    <div className="w-full my-16 md:my-0">
      {/* Hero */}
      <CollectionHero
        title={collection?.title}
        description={collection?.description}
        mobileImage={collection?.mobileImage}
        desktopImage={collection?.desktopImage}
        loading={heroLoading}
      />

      {/* Filter bar — sticky (no z-index here: a z-index would create a stacking context that traps FilterDrawer's fixed children below the header) */}
      <div className="bg-white">
        {heroLoading ? (
          <div className="w-full h-[48px] bg-gray-100 animate-pulse" />
        ) : (
          <FilterBar
            refBar={refBar}
            total={totalElements}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            onUpdateFilters={() => {}}
            metals={[]}
            sizes={[]}
            previewTotal={null}
            previewLoading={false}
            onPreviewFilters={() => {}}
            stickyTop="top-16"
          />
        )}
      </div>

      {/* Products grid */}
      <div className="px-4 md:px-8 mt-6 md:mt-8">
        {/* Mobile grid */}
        <div className="md:hidden">
          <CollectionProductGrid
            products={mobileAll}
            banners={banners}
            loading={productsLoading}
            onBannerClick={setActiveBanner}
          />

          {/* Load-more button */}
          {!productsLoading && mobileHasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={handleMobileLoadMore}
                className="w-full max-w-full h-[42px] text-[12px] font-[400] leading-[18px] text-black border border-black rounded-[4px] hover:bg-gray-50 uppercase"
              >
                {t("loadMore", {
                  count: totalElements - mobileAll.length,
                })}
              </Button>
            </div>
          )}
        </div>

        {/* Desktop grid */}
        <div className="hidden md:block">
          {productsLoading ? (
            <div className="grid grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[364px] w-full rounded-md" />
              ))}
            </div>
          ) : (
            <CollectionProductGrid
              products={products}
              banners={banners}
              loading={false}
              onBannerClick={setActiveBanner}
            />
          )}

          {/* Pagination */}
          {!productsLoading && totalPages > 1 && (
            <CatalogPagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          )}

          {/* Space before footer */}
          <div className="h-[160px]" />
        </div>
      </div>

      {/* Banner panel (mobile layer + desktop drawer) */}
      <CollectionBannerPanel
        banner={activeBanner}
        onClose={() => setActiveBanner(null)}
      />
    </div>
  );
}
