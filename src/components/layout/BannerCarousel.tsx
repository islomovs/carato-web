/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useId, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import SwiperNavigation from "../shared/SwiperNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  name: string;
  desktopImage: string;
}

interface BannerCarouselProps {
  items?: Banner[];
  isLoading?: boolean;
}

export default function BannerCarousel({
  items = [],
  isLoading = false,
}: BannerCarouselProps) {
  const swiperRef = useRef<any>(null);
  const id = useId();

  const [activeIndex, setActiveIndex] = useState(0);

  const prevClass = `swiper-button-prev-${id}`;
  const nextClass = `swiper-button-next-${id}`;

  const fallbackBanners: Banner[] = [
    { id: "1", name: "Promo 1", desktopImage: "/images/promo1.jpg" },
    { id: "2", name: "Promo 2", desktopImage: "/images/promo2.jpg" },
  ];

  const bannerItems = items.length > 0 ? items : fallbackBanners;

  return (
    <div className="relative w-full text-center">
      <SwiperNavigation prevClass={prevClass} nextClass={nextClass} />

      <Swiper
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={bannerItems.length > 1}
        modules={[Navigation, Pagination, Autoplay]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        spaceBetween={20}
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
                  src={item.desktopImage}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />

                <div
                  className="
                    absolute inset-0 
                    flex flex-col justify-center items-start
                    max-w-[65%] md:max-w-[40%]
                    px-4 
                    md:px-0 md:top-1/5 md:right-[8%] md:left-auto
                    md:items-start md:justify-start
                    gap-4 md:gap-8
                  "
                >
                  <h1 className="text-lg md:text-5xl font-light text-start md:leading-[72px] text-white md:text-black">
                    Элегантные сережки со скидкой -20%
                  </h1>

                  <Button className="hidden md:block bg-black text-white w-[280px] h-[52px] text-sm uppercase font-normal rounded-md hover:text-black border border-black hover:bg-white z-10 cursor-pointer">
                    Подробнее
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>

      {/* Custom Pagination */}
      <div className="absolute bottom-[16px] md:bottom-[24px] left-0 right-0 flex justify-center items-center gap-1 z-[20]">
        {bannerItems.map((_, index) => (
          <motion.span
            key={index}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-full bg-white"
            style={{
              width: activeIndex === index ? 24 : 8,
              height: 8,
              opacity: activeIndex === index ? 1 : 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}
