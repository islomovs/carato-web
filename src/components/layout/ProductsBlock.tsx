"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "../shared/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Product } from "@/services/product";
import useLockScroll from "@/hooks/useLockScroll";
import ProductsBlockModal from "../shared/product/ProductsBlockModal";

interface ProductsBlockProps {
  title: string;
  products: Product[];
  layout?: "carousel" | "grid";
  hideSeeAll?: boolean;
}

export default function ProductsBlock({
  title,
  products,
  layout = "carousel",
  hideSeeAll = false,
}: ProductsBlockProps) {
  const t = useTranslations("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const handleOpen = (product: Product) => setSelectedProduct(product);
  const handleClose = () => setSelectedProduct(null);

  useLockScroll(selectedProduct ? true : false);

  return (
    <>
      <div className="flex flex-col items-start my-20 md:my-40 mx-4 md:mx-8 overflow-hidden">
        <h1 className="text-[28px] md:text-[52px] mb-4 md:mb-[52px] font-light text-black">
          {title}
        </h1>

        {layout === "carousel" ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={products.length > 1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            className="w-full !overflow-hidden"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} onOpen={handleOpen} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 w-full">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={handleOpen}
              />
            ))}
          </div>
        )}

        {!hideSeeAll && (
          <Button
            variant="outline"
            className="mt-6 md:mt-20 w-full md:w-[280px] h-[36px] md:h-[52px] text-sm uppercase font-normal rounded-md bg-white text-black border border-black hover:bg-black hover:!text-white transition-colors duration-200 cursor-pointer md:self-center"
          >
            {t("seeAll")}
          </Button>
        )}
      </div>
      {selectedProduct && (
        <ProductsBlockModal
          slug={selectedProduct.slug}
          onClose={handleClose}
          selectedProduct={selectedProduct}
        />
      )}
    </>
  );
}
