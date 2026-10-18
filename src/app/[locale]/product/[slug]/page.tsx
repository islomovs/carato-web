"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FeedbackSection from "@/components/shared/feedback/FeedbackSection";
import ProductAccordion from "@/components/shared/product/ProductAccordion";
import ProductGallery from "@/components/shared/product/ProductGallery";
import ProductInfo from "@/components/shared/product/ProductInfo";
import SellerInfoButton from "@/components/shared/product/SellerInfoButton";
import { usePathname } from "next/navigation";
import { useProductBySlug } from "@/hooks/useProductBySlug";
import { MediaItemT } from "@/components/shared/product/MediaItem";
import { Skeleton } from "@/components/ui/skeleton";
import SellerLayer from "@/components/shared/seller/SellerLayer";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import useLockScroll from "@/hooks/useLockScroll";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useIsAuthenticated } from "@/lib/authStore";
import { toast } from "sonner";

export default function ProductPage() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();
  const [isMobile, setIsMobile] = useState(false);
  const { product, loading, error } = useProductBySlug(slug);
  const [sellerOpen, setSellerOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

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

  const [mounted, setMounted] = useState(false);
  useLockScroll(sellerOpen);

  const { add: addToWishlist, remove: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isAuthenticated = useIsAuthenticated();
  const inWishlist = product ? isInWishlist(product.slug) : false;

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted || loading) {
    return (
      <div className="px-4 md:px-8 my-[52px]">
        <div className="grid md:grid-cols-[1fr_40%] gap-[52px]">
          <ProductGallery variant="page" media={[]} loading />
          <div className="flex flex-col gap-8">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Desktop layout */}
      {!isMobile ? (
        <>
          <div
            className="grid
          grid-cols-1
          md:grid-cols-[1fr_minmax(300px,40%)]
          lg:grid-cols-[minmax(0,1fr)_minmax(0,37%)]
          gap-[52px]
          px-4 md:px-8
          my-[52px]"
          >
            <div className="flex flex-col gap-8">
              <ProductGallery variant="page" media={media} loading={loading} />
              <SellerInfoButton
                seller={product ? product.seller : null}
                onClick={() => {
                  if (product?.seller) {
                    if (window.innerWidth >= 768) {
                      sessionStorage.setItem(
                        "sellerData",
                        JSON.stringify(product.seller),
                      );
                      router.push(`/${locale}/seller/${product.seller.slug}`);
                    } else {
                      setSellerOpen(true);
                    }
                  }
                }}
              />
              <ProductAccordion
                description={product ? product.description : ""}
                chracteristics={product ? product.characteristics : ""}
                loading={loading}
              />
              <FeedbackSection
                overallRating={product ? Math.round(product.averageRating) : 5}
                totalReviews={product ? product.reviewsQuantity : 10}
                slug={product ? product.slug : ""}
                loading={loading}
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
                {product && (
                  <ProductInfo product={product} isLoading={loading} />
                )}
              </>
            )}
          </div>
        </>
      ) : (
        // ✅ Mobile layout
        <div className="flex flex-col w-full mb-[132px]">
          {/* Product gallery at top with floating action bar */}
          <div className="w-full relative">
            <ProductGallery variant="modal" media={media} loading={loading} />

            {/* Floating top bar: back | wishlist + share */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-start pointer-events-none"
              style={{ paddingLeft: 8, paddingTop: 16, paddingRight: 8 }}>
              <button
                onClick={() => router.back()}
                className="w-[36px] h-[36px] flex items-center justify-center pointer-events-auto"
              >
                <Image src="/icons/chevron-left.svg" alt="back" width={20} height={20} />
              </button>

              <div className="flex items-center pointer-events-auto" style={{ gap: 4 }}>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push(`/${locale}/auth?returnTo=${encodeURIComponent(pathname)}`);
                      return;
                    }
                    if (inWishlist) {
                      removeFromWishlist(product!.slug);
                      toast.success("Удалено из избранного");
                    } else {
                      addToWishlist(product!.slug, locale);
                      toast.success("Добавлено в избранное");
                    }
                  }}
                  className="w-[36px] h-[36px] flex items-center justify-center"
                >
                  <Image
                    src={inWishlist ? "/icons/heart-filled.svg" : "/icons/heart.svg"}
                    alt="wishlist"
                    width={20}
                    height={20}
                  />
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Ссылка скопирована");
                    }
                  }}
                  className="w-[36px] h-[36px] flex items-center justify-center"
                >
                  <Image src="/icons/share.svg" alt="share" width={20} height={20} />
                </button>
              </div>
            </div>
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
              seller={product ? product.seller : null}
              onClick={() => product?.seller && setSellerOpen(true)}
            />
            <ProductAccordion
              description={product ? product.description : " "}
              chracteristics={product ? product.characteristics : ""}
              loading={loading}
            />
            <FeedbackSection
              overallRating={product ? Math.round(product.averageRating) : 5}
              totalReviews={product ? product.reviewsQuantity : 10}
              slug={product ? product.slug : ""}
              loading={loading}
            />
          </div>

          {/* <ProductsBlock
            title={t("recommended")}
            products={sampleProducts}
            hideSeeAll
          /> */}
        </div>
      )}
      {product?.seller && (
        <SellerLayer
          seller={product.seller}
          open={sellerOpen}
          onClose={() => setSellerOpen(false)}
        />
      )}
    </div>
  );
}
