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
          {product && <ProductInfo product={product} isLoading={loading} />}
        </div>
      ) : (
        // ✅ Mobile layout
        <div className="flex flex-col w-full overflow-hidden">
          {/* Product gallery at top (scrolls naturally) */}
          <div className="w-full">
            <ProductGallery variant="modal" media={media} />
          </div>

          {/* Page content below gallery */}
          <div className="flex flex-col gap-8 px-4 py-8 relative bg-white">
            {product && <ProductInfo product={product} isLoading={loading} />}
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
        </div>
      )}
    </div>
  );
}
