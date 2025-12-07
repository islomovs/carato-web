"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { NavButton } from "../ui/nav-button";
import { useCategories } from "@/hooks/useCategories";
import { SkeletonCategoriesBlock } from "../shared/SkeletonCategoriesBlock";
import { useRouter } from "next/navigation";

export default function CategoriesBlock() {
  const t = useTranslations("home");
  const { categories, loading, error } = useCategories();
  const router = useRouter();
  if (loading) return <SkeletonCategoriesBlock />;

  if (error) return <div className="text-red-600">{t("loadError")}</div>;

  return (
    <div className="flex flex-col gap-6 md:gap-[52px] w-full my-24">
      <h1 className="text-[28px] md:text-[52px] self-start font-light text-black mx-4 md:mx-8">
        {t("categoriesTitle")}
      </h1>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-3">
        {categories.slice(0, 6).map((category) => (
          <div
            key={category.id}
            onClick={() => router.push("/products?category=" + category.slug)}
            className="relative w-full h-[320px] overflow-hidden group"
          >
            <Image
              src={category.desktopImage || "/images/category-placeholder.png"}
              alt={category.name || "Category Image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-8 left-8 flex flex-col gap-2 text-white">
              <h2 className="text-[28px] lowercase font-normal">
                {category.name}
              </h2>
              <NavButton
                active
                className="w-fit uppercase text-white hover:text-white"
                underlineColor="white"
              >
                {t("seeAll")}
              </NavButton>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="block md:hidden">
        <Swiper slidesPerView={1.5} className="w-full h-[400px]">
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <div className="relative w-full h-[400px] overflow-hidden">
                <Image
                  src={
                    category.mobileImage || "/images/category-placeholder.png"
                  }
                  alt={category.name || "Category Image"}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-8 left-8 flex flex-col gap-2 text-white">
                  <h2 className="text-[28px] lowercase font-normal">
                    {category.name}
                  </h2>
                  <NavButton
                    active
                    className="w-fit uppercase text-white hover:text-white"
                    underlineColor="white"
                  >
                    {t("seeAll")}
                  </NavButton>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
