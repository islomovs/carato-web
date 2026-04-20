"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/shared/product/ProductCard";
import {
  CollectionBanner,
  CollectionBannerProduct,
} from "@/services/collections";
import { NavButton } from "@/components/ui/nav-button";
import { useTranslations } from "next-intl";

type MobileGridItem =
  | { kind: "product"; data: CollectionBannerProduct }
  | { kind: "banner"; data: CollectionBanner };

type DesktopGridItem =
  | { kind: "product"; data: CollectionBannerProduct }
  | {
      kind: "banner";
      data: CollectionBanner;
      gridProducts: CollectionBannerProduct[];
    };

interface Props {
  products: CollectionBannerProduct[];
  banners: CollectionBanner[];
  loading?: boolean;
  onBannerClick: (banner: CollectionBanner) => void;
}

/**
 * Mobile (2-col) item sequence:
 *   First row : 2 products
 *   Per banner:
 *     rowNumber=1 → 1 product (left) + banner (right, col-span-1)
 *     rowNumber=2 → banner (col-span-2, full row)
 *   After each banner: 4 product gap
 *   Remaining products
 */
function buildMobileItems(
  products: CollectionBannerProduct[],
  banners: CollectionBanner[],
): MobileGridItem[] {
  const sorted = [...banners].sort((a, b) => a.rowNumber - b.rowNumber);
  const items: MobileGridItem[] = [];
  let pIdx = 0;

  // First row: 2 products
  for (let i = 0; i < 2 && pIdx < products.length; i++) {
    items.push({ kind: "product", data: products[pIdx++] });
  }

  for (const banner of sorted) {
    if (banner.rowNumber === 1) {
      // 1 product on the left, banner on the right
      if (pIdx < products.length) {
        items.push({ kind: "product", data: products[pIdx++] });
      }
      items.push({ kind: "banner", data: banner });
    } else {
      // Full-row banner (col-span-2)
      items.push({ kind: "banner", data: banner });
    }
    // 4 product gap after banner
    for (let gap = 0; gap < 4 && pIdx < products.length; gap++) {
      items.push({ kind: "product", data: products[pIdx++] });
    }
  }

  while (pIdx < products.length) {
    items.push({ kind: "product", data: products[pIdx++] });
  }

  return items;
}

/**
 * Desktop (4-col) item sequence:
 *   Per banner:
 *     rowNumber=1 → 2 products (cols 1-2) + banner (cols 3-4, col-span-2)
 *     rowNumber=2 → 4 products (fill a row) + banner (col-span-4, full row)
 *                   The banner's right 2×2 uses the next 4 products from the pool
 *   After each banner: 4 product gap
 *   Remaining products
 */
function buildDesktopItems(
  products: CollectionBannerProduct[],
  banners: CollectionBanner[],
): DesktopGridItem[] {
  const sorted = [...banners].sort((a, b) => a.rowNumber - b.rowNumber);
  const items: DesktopGridItem[] = [];
  let pIdx = 0;

  for (const banner of sorted) {
    if (banner.rowNumber === 1) {
      // 2 products fill left cols, banner fills right 2 cols of the same row
      for (let i = 0; i < 2 && pIdx < products.length; i++) {
        items.push({ kind: "product", data: products[pIdx++] });
      }
      items.push({ kind: "banner", data: banner, gridProducts: [] });
    } else {
      // rowNumber=2: fill a complete row (4 products) so banner starts on a fresh row
      for (let i = 0; i < 4 && pIdx < products.length; i++) {
        items.push({ kind: "product", data: products[pIdx++] });
      }
      // Banner internally uses next 4 collection products for its right 2×2
      const bannerGridProducts = products.slice(pIdx, pIdx + 4);
      pIdx += Math.min(4, products.length - pIdx);
      items.push({
        kind: "banner",
        data: banner,
        gridProducts: bannerGridProducts,
      });
    }
    // 4 product gap after banner
    for (let gap = 0; gap < 4 && pIdx < products.length; gap++) {
      items.push({ kind: "product", data: products[pIdx++] });
    }
  }

  while (pIdx < products.length) {
    items.push({ kind: "product", data: products[pIdx++] });
  }

  return items;
}

export default function CollectionProductGrid({
  products,
  banners,
  loading,
  onBannerClick,
}: Props) {
  const t = useTranslations("collection");

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="w-full aspect-[166/196]" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const mobileItems = buildMobileItems(products, banners);
  const desktopItems = buildDesktopItems(products, banners);

  return (
    <>
      {/* ─── Mobile grid (2-col) ─────────────────────────────────── */}
      <div className="md:hidden grid grid-cols-2 gap-x-3 gap-y-6">
        {mobileItems.map((item, idx) => {
          if (item.kind === "product") {
            return (
              <div key={`m-product-${item.data.slug}-${idx}`}>
                <ProductCard product={item.data as never} />
              </div>
            );
          }
          const isLarge = item.data.rowNumber === 2;
          return (
            <div
              key={`m-banner-${item.data.id}`}
              className={isLarge ? "col-span-2" : "col-span-1"}
              onClick={() => onBannerClick(item.data)}
            >
              {isLarge ? (
                <MobileLargeBanner banner={item.data} t={t} />
              ) : (
                <SmallBannerCell banner={item.data} t={t} />
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Desktop grid (4-col) ────────────────────────────────── */}
      <div className="hidden md:grid grid-cols-4 gap-5">
        {desktopItems.map((item, idx) => {
          if (item.kind === "product") {
            return (
              <div key={`d-product-${item.data.slug}-${idx}`}>
                <ProductCard product={item.data as never} />
              </div>
            );
          }
          const isLarge = item.data.rowNumber === 2;
          return (
            <div
              key={`d-banner-${item.data.id}`}
              className={isLarge ? "col-span-4" : "col-span-2"}
              onClick={() => onBannerClick(item.data)}
            >
              {isLarge ? (
                <DesktopLargeBanner
                  banner={item.data}
                  gridProducts={item.gridProducts}
                  t={t}
                />
              ) : (
                <SmallBannerCell banner={item.data} t={t} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ─── Shared small banner (rowNumber=1) ─────────────────────────────────── */
function SmallBannerCell({
  banner,
  t,
}: {
  banner: CollectionBanner;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="relative w-full h-full overflow-hidden aspect-[166/196] md:aspect-auto cursor-pointer">
      {banner.image && (
        <Image
          src={banner.image}
          alt="Collection banner"
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      )}
      <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6">
        <NavButton
          active
          className="text-white hover:text-white uppercase text-[14px] font-[400]"
          underlineColor="white"
        >
          {t("learnMore")}
        </NavButton>
      </div>
    </div>
  );
}

/* ─── Mobile large banner (rowNumber=2) — image only ────────────────────── */
function MobileLargeBanner({
  banner,
  t,
}: {
  banner: CollectionBanner;
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="relative w-full h-[200px] overflow-hidden cursor-pointer">
      {banner.image && (
        <Image
          src={banner.image}
          alt="Collection banner"
          fill
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute bottom-3 left-3">
        <NavButton
          active
          className="text-white hover:text-white uppercase text-[14px] font-[400]"
          underlineColor="white"
        >
          {t("learnMore")}
        </NavButton>
      </div>
    </div>
  );
}

/* ─── Desktop large banner (rowNumber=2) — image left + products right ──── */
function DesktopLargeBanner({
  banner,
  gridProducts,
  t,
}: {
  banner: CollectionBanner;
  gridProducts: CollectionBannerProduct[];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
      className="grid grid-cols-2 gap-5 cursor-pointer"
      style={{ height: 748 }}
    >
      {/* Left: full-height banner image */}
      <div className="relative h-full overflow-hidden">
        {banner.image && (
          <Image
            src={banner.image}
            alt="Collection banner"
            fill
            sizes="25vw"
            className="object-cover"
          />
        )}
        <div className="absolute bottom-6 left-6">
          <NavButton
            active
            className="text-white hover:text-white uppercase text-[14px] font-[400]"
            underlineColor="white"
          >
            {t("learnMore")}
          </NavButton>
        </div>
      </div>

      {/* Right: 2×2 grid of collection products */}
      <div className="grid grid-cols-2 gap-5 content-start">
        {gridProducts.map((p) => (
          <ProductCard key={p.slug} product={p as never} />
        ))}
        {Array.from({ length: Math.max(0, 4 - gridProducts.length) }).map(
          (_, i) => (
            <div key={`empty-${i}`} />
          ),
        )}
      </div>
    </div>
  );
}
