"use client";

import { useTranslations } from "next-intl";
import ProductCard, { Product } from "../shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface ProductsBlockProps {
  title: string;
  products: Product[];
  layout?: "carousel" | "grid";
}

export default function ProductsBlock({
  title,
  products,
  layout = "carousel",
}: ProductsBlockProps) {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col p-8 items-start gap-[52px] my-40">
      <h1 className="text-[52px] font-light text-black">{title}</h1>

      {/* Conditional Layout */}
      {layout === "carousel" ? (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
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
            <SwiperSlide key={product.id} className="flex justify-center">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Button
        variant="outline"
        className="self-center w-[280px] h-[52px] text-sm uppercase font-normal rounded-md 
          bg-white text-black border border-black hover:bg-black hover:!text-white 
          transition-colors duration-200 cursor-pointer mt-8"
      >
        {t("seeAll")}
      </Button>
    </div>
  );
}
