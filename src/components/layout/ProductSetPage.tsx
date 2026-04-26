"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  getProductSets,
  getProductsBySetPaginated,
} from "@/services/productSets";
import { Product } from "@/services/product";
import ProductGrid from "../shared/catalog/ProductGrid";
import CatalogPagination from "../shared/catalog/CatalogPagination";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 20;

export default function ProductSetPage({ slug }: { slug: string }) {
  const t = useTranslations("seller");
  const locale = useLocale();
  const [title, setTitle] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Resolve title from slug
  useEffect(() => {
    getProductSets(locale).then((sets) => {
      const match = sets.find((s) => s.slug === slug);
      if (match) setTitle(match.name);
    });
  }, [slug, locale]);

  useEffect(() => {
    setLoading(true);
    getProductsBySetPaginated(slug, page, PAGE_SIZE, locale).then((data) => {
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setLoading(false);
    });
  }, [slug, page, locale]);

  const mobileProducts = products.slice(0, visibleCount);

  return (
    <div className="w-full pt-16 md:pt-0">
      <div className="flex items-center justify-center my-[52px]">
        <h1 className="text-[28px] leading-[34px] text-center font-[400]">
          {title}
        </h1>
      </div>

      <div className="w-full p-4 md:px-8 md:pt-8 mb-40">
        <div className="md:hidden">
          <ProductGrid products={mobileProducts} loading={loading} />
          {visibleCount < totalElements && (
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                onClick={() =>
                  setVisibleCount((p) => Math.min(p + PAGE_SIZE, totalElements))
                }
                className="w-[400px] max-w-full py-[8px] text-[12px] text-black border-black hover:bg-gray-50"
              >
                {t("loadMore", { count: totalElements - visibleCount })}
              </Button>
            </div>
          )}
        </div>

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
    </div>
  );
}
