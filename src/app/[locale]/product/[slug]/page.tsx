"use client";

import { useEffect, useState } from "react";
import FeedbackSection from "@/components/shared/feedback/FeedbackSection";
import ProductAccordion from "@/components/shared/product/ProductAccordion";
import ProductGallery from "@/components/shared/product/ProductGallery";
import ProductInfo from "@/components/shared/product/ProductInfo";
import SellerInfoButton from "@/components/shared/product/SellerInfoButton";
import { usePathname } from "next/navigation";
import { useProductBySlug } from "@/hooks/useProductBySlug";
import { MediaItemT } from "@/components/shared/product/MediaItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductPage() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const [isMobile, setIsMobile] = useState(false);

  const { product, loading, error } = useProductBySlug(slug);

  const media: MediaItemT[] = product
    ? product.images.map((img, idx) => {
        const isVideo = img.image.toLowerCase().endsWith(".mp4");
        return {
          id: idx + 1,
          type: isVideo ? "video" : "image",
          src: img.image,
        };
      })
    : [];

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p>Ошибка загрузки продукта. Пожалуйста, попробуйте позже.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Desktop layout */}
      {!isMobile ? (
        <div
          className="grid
          grid-cols-1
          md:grid-cols-[1fr_minmax(300px,40%)]
          lg:grid-cols-[minmax(0,1fr)_minmax(0,37%)]
          gap-[52px]
          px-4 md:px-8
          my-[52px]
          overflow-hidden"
        >
          <div className="flex flex-col gap-8">
            <ProductGallery variant="page" media={media} />
            <SellerInfoButton
              imageSrc="/images/banner-placeholder.jpg"
              title={product ? product.category.name : "JewelStore"}
              rating={product ? Math.round(product.averageRating) : 5}
              sellerUrl="/seller/jewelstore"
            />
            <ProductAccordion
              description={product ? product.description : ""}
              chracteristics={product ? product.characteristics : ""}
            />
            <FeedbackSection
              overallRating={product ? Math.round(product.averageRating) : 5}
              totalReviews={product ? product.reviewsQuantity : 10}
              slug={product ? product.slug : ""}
            />
          </div>
          {loading ? (
            <div className="flex flex-col gap-8 w-full pb-[10px] animate-in fade-in">
              {/* Skeleton placeholders */}
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-8 w-72" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-10" />
              </div>
              <Skeleton className="h-14 w-full rounded-md" />
              <div className="hidden md:flex flex-col gap-3">
                <Skeleton className="h-[52px] w-full rounded-md" />
                <Skeleton className="h-[52px] w-[52px] rounded-md" />
                <Skeleton className="h-[52px] w-full rounded-md" />
              </div>
            </div>
          ) : (
            <>
              {product && <ProductInfo product={product} isLoading={loading} />}
            </>
          )}
        </div>
      ) : (
        // ✅ Mobile layout
        <div className="flex flex-col w-full overflow-hidden mb-[132px]">
          {/* Product gallery at top (scrolls naturally) */}
          <div className="w-full">
            <ProductGallery variant="modal" media={media} loading={loading} />
          </div>

          {/* Page content below gallery */}
          <div className="flex flex-col gap-8 px-4 py-8 relative bg-white">
            {loading ? (
              <div className="flex flex-col gap-8 w-full pb-[10px] animate-in fade-in">
                {/* Skeleton placeholders */}
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-8 w-72" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-7 w-28" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-10" />
                </div>
                <Skeleton className="h-14 w-full rounded-md" />
                <div className="hidden md:flex flex-col gap-3">
                  <Skeleton className="h-[52px] w-full rounded-md" />
                  <Skeleton className="h-[52px] w-[52px] rounded-md" />
                  <Skeleton className="h-[52px] w-full rounded-md" />
                </div>
              </div>
            ) : (
              <>
                {product && (
                  <ProductInfo product={product} isLoading={loading} />
                )}
              </>
            )}
            <SellerInfoButton
              imageSrc="/images/banner-placeholder.jpg"
              title="JewelStore"
              rating={product ? Math.round(product.averageRating) : 5}
              sellerUrl="/seller/jewelstore"
            />
            <ProductAccordion
              description={product ? product.description : " "}
              chracteristics={product ? product.characteristics : ""}
            />
            <FeedbackSection
              overallRating={product ? Math.round(product.averageRating) : 5}
              totalReviews={product ? product.reviewsQuantity : 10}
              slug={product ? product.slug : ""}
            />
          </div>

          {/* <ProductsBlock
            title={t("recommended")}
            products={sampleProducts}
            hideSeeAll
          /> */}
          <div className="fixed bottom-0 left-0 right-0 px-4 py-4 flex gap-4 border-t border-[#EEF2F6] bg-white z-50">
            <Button
              variant="outline"
              className="flex-1 h-[52px] uppercase font-[400] text-[14px]"
            >
              Быстрая покупка
            </Button>

            <Button
              variant="default"
              className="flex-1 h-[52px] uppercase font-[400] text-[14px] bg-black text-white py-[12px] px-4 hover:bg-white hover:text-black border border-black"
            >
              В корзину
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
