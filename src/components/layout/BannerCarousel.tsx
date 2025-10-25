/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useId, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import SwiperNavigation from "../shared/SwiperNavigation";
import { useBanners } from "@/hooks/useBanners";
import { useTranslations } from "use-intl";

export default function BannerCarousel() {
  const swiperRef = useRef<any>(null);
  const id = useId();
  const t = useTranslations("home");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { banners, isLoading } = useBanners();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const prevClass = `swiper-button-prev-${id}`;
  const nextClass = `swiper-button-next-${id}`;

  const PLACEHOLDER = "/images/banner-placeholder.jpg";
  const PLACEHOLDER_BANNERS = [
    {
      id: "placeholder",
      name: "Добро пожаловать в Carato",
      image: PLACEHOLDER,
      redirectTo: "#",
    },
  ];

  const bannerItems =
    banners?.length > 0
      ? banners.map((item) => ({
          id: String(item.id),
          name: item.text || "Без названия",
          image: isMobile
            ? item.mobileImage || PLACEHOLDER
            : item.desktopImage || PLACEHOLDER,
          redirectTo: item.redirectTo || "#",
        }))
      : PLACEHOLDER_BANNERS;

  return (
    <div className="relative w-full text-center">
      <SwiperNavigation prevClass={prevClass} nextClass={nextClass} />

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={bannerItems.length > 1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        slidesPerView={1}
      >
        {isLoading ? (
          <SwiperSlide>
            <div className="relative w-full aspect-[72/35] overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          </SwiperSlide>
        ) : (
          bannerItems.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative w-full overflow-hidden h-[182px] md:h-auto md:aspect-[72/35]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = PLACEHOLDER;
                  }}
                />

                <div className="absolute inset-0 flex flex-col justify-center items-start max-w-[65%] md:max-w-[50%] px-4 md:px-0 md:top-1/5 md:right-[8%] md:left-auto gap-4 md:gap-8">
                  <h1 className="text-lg md:text-[40px] font-light text-start md:leading-[60px] text-white md:text-black">
                    {item.name}
                  </h1>

                  <Button
                    onClick={() =>
                      item.redirectTo !== "#" &&
                      window.open(item.redirectTo, "_blank")
                    }
                    className="hidden md:block bg-black text-white w-[280px] h-[52px] text-sm uppercase  font-normal rounded-md hover:text-black border border-black hover:bg-white"
                  >
                    {t("learnMoreBanner")}
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>

      {/* Pagination */}
      <div className="absolute bottom-[16px] md:bottom-[24px] left-0 right-0 flex justify-center items-center gap-1 z-[20]">
        {bannerItems.map((_, index) => (
          <motion.span
            key={index}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-full bg-white cursor-pointer"
            style={{
              width: activeIndex === index ? 24 : 8,
              height: 8,
              opacity: activeIndex === index ? 1 : 0.6,
            }}
            onClick={() => {
              swiperRef.current?.slideToLoop(index);
              setActiveIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
