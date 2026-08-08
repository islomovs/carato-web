/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useCollections } from "@/hooks/useCollection";
import {
  useCategoriesCatalogue,
  useCategoryCatalogue,
} from "@/hooks/useCategoriesCatalogue";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DrillLevel {
  slug: string;
  title: string;
  type: "catalogue" | "category";
  items?: any[]; // pre-loaded subcategories
}

// ─── Category Grid Cell ───────────────────────────────────────────────────────

function GridCell({
  title,
  imageSrc,
  onClick,
}: {
  title: string;
  imageSrc?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-[4px] bg-[#EAECF0] overflow-hidden aspect-square w-full text-left active:bg-[#D1D5DB] transition-colors"
    >
      {/* Title top-left */}
      <p
        className="absolute top-3 left-3 right-3 z-10"
        style={{ fontWeight: 500, fontSize: 16, lineHeight: "22px" }}
      >
        {title}
      </p>

      {/* Image bottom-right */}
      {imageSrc && (
        <div className="absolute bottom-0 right-0 w-[60%] aspect-square">
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        </div>
      )}
    </button>
  );
}

// ─── Drill-down Layer ─────────────────────────────────────────────────────────

function CatalogDrillLayer({
  slug,
  title,
  type,
  onClose,
  onBack,
  preloadedItems,
}: {
  slug: string;
  title: string;
  type: "catalogue" | "category";
  onClose: () => void;
  onBack: () => void;
  preloadedItems?: any[];
}) {
  const t = useTranslations("mobileCatalog");
  const router = useRouter();
  const locale = useLocale();
  const [nextLevel, setNextLevel] = useState<DrillLevel | null>(null);

  const { catalogue, loading: catalogueLoading } = useCategoryCatalogue(
    type === "catalogue" ? slug : null,
  );

  const loading = type === "catalogue" ? catalogueLoading : false;

  const items: any[] =
    type === "catalogue"
      ? (catalogue?.categories ?? [])
      : (preloadedItems ?? []);

  const handleItemClick = (item: any) => {
    const hasSubcategories = item.subcategories?.length > 0;

    if (!hasSubcategories) {
      // Leaf node — navigate to products
      router.push(`/${locale}/products/${item.slug}`);
      return;
    }

    // Has children — drill deeper
    setNextLevel({
      slug: item.slug,
      title: item.name,
      type: "category",
      items: item.subcategories, // pass subcategories directly, no extra fetch needed
    });
  };

  return (
    <>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 bg-white z-[80] flex flex-col"
        style={{ paddingBottom: 52 }} // space for MobileAppBar
      >
        {/* Header */}
        <div
          className="flex items-center border-b border-[#EEF2F6] flex-shrink-0 relative"
          style={{ height: 64 }}
        >
          <button
            onClick={onBack}
            className="absolute flex items-center justify-center"
            style={{ left: 8, width: 36, height: 36 }}
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>

          <div className="flex-1 flex items-center justify-center px-12">
            <span
              className="uppercase text-center truncate"
              style={{ fontWeight: 300, fontSize: 14, lineHeight: "20px" }}
            >
              {title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="absolute flex items-center justify-center"
            style={{ right: 8, width: 36, height: 36 }}
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-4 pt-8 pb-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[4px] bg-[#EAECF0] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {/* First cell: See all — always navigates to products of current slug */}
              <GridCell
                title={t("seeAll")}
                onClick={() => router.push(`/${locale}/products/${slug}`)}
              />
              {items.map((item: any) => (
                <GridCell
                  key={item.id}
                  title={item.name}
                  imageSrc={item.catalogIcon ?? item.mobileImage ?? undefined}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {nextLevel && (
          <CatalogDrillLayer
            slug={nextLevel.slug}
            title={nextLevel.title}
            type={nextLevel.type}
            onClose={onClose}
            onBack={() => setNextLevel(null)}
            preloadedItems={nextLevel.items}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Mobile Catalog Page ─────────────────────────────────────────────────

export default function MobileCatalogPage() {
  const t = useTranslations("mobileCatalog");
  const locale = useLocale();
  const router = useRouter();

  const { collections, loading: collectionsLoading } = useCollections(locale);
  const { catalogues, loading: cataloguesLoading } = useCategoriesCatalogue();

  const [activeDrill, setActiveDrill] = useState<DrillLevel | null>(null);

  return (
    <div
      className="w-full bg-white"
      style={{ paddingTop: 32 + 64, paddingBottom: 52 + 16 }} // 52px appbar + 16px extra
    >
      {/* ── Collections section ── */}
      <div className="border-b border-[#EEF2F6]">
        <p className="px-4 mb-4 font-medium text-base leading-[22px]">
          {t("collectionsTitle")}
        </p>

        {collectionsLoading ? (
          <div className="flex gap-3 px-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[160px]">
                <div className="w-[136px] h-[166px] bg-[#EAECF0] animate-pulse rounded-sm" />
                <div className="h-4 w-24 bg-[#EAECF0] animate-pulse rounded mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            slidesPerView="auto"
            spaceBetween={0}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            className="w-full"
          >
            {collections.map((item) => (
              <SwiperSlide
                key={item.id}
                style={{ width: "auto", paddingRight: 0 }}
              >
                <div
                  className="cursor-pointer pb-6"
                  style={{ paddingRight: 16 }}
                  onClick={() =>
                    router.push(`/${locale}/products/${item.slug ?? ""}`)
                  }
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden"
                    style={{ width: 136, height: 166 }}
                  >
                    <Image
                      src={
                        item.mobileImage ||
                        item.desktopImage ||
                        "/images/collection-placeholder.webp"
                      }
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Title */}
                  <p
                    className="mt-2"
                    style={{
                      fontWeight: 300,
                      fontSize: 14,
                      lineHeight: "20px",
                      width: 136,
                    }}
                  >
                    {item.title}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* ── Catalog grid ── */}
      <div className="px-4 mt-6">
        {cataloguesLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-[4px] bg-[#EAECF0] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {catalogues.map((cat) => (
              <GridCell
                key={cat.id}
                title={cat.name}
                imageSrc={(cat as any).mobileImage || (cat as any).desktopImage}
                onClick={() =>
                  setActiveDrill({
                    slug: cat.slug,
                    title: cat.name,
                    type: "catalogue",
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Drill-down layers ── */}
      <AnimatePresence>
        {activeDrill && (
          <CatalogDrillLayer
            slug={activeDrill.slug}
            title={activeDrill.title}
            type={activeDrill.type}
            onClose={() => setActiveDrill(null)}
            onBack={() => setActiveDrill(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
