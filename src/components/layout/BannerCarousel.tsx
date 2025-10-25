/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef, useId, useState, useEffect } from "react";
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
import { useBanners } from "@/hooks/useBanners";
import { useTranslations } from "use-intl";

/**
 * Robust BannerImage:
 * - sanitizes incoming src
 * - keeps local displaySrc state and falls back to placeholder on error
 * - logs debug info
 * - if next/image onError doesn't fire for some reason, renders an <img> fallback
 */
function BannerImage({ src, alt }: { src?: string | null; alt?: string }) {
  const PLACEHOLDER = "/images/banner-placeholder.jpg";
  // sanitize incoming src: guard against null/"null"/empty
  const sanitize = (s?: string | null) => {
    if (!s) return null;
    const trimmed = String(s).trim();
    if (trimmed === "" || trimmed.toLowerCase() === "null") return null;
    return trimmed;
  };

  const initial = sanitize(src) ?? PLACEHOLDER;
  const [displaySrc, setDisplaySrc] = useState<string>(initial);
  const [useImgFallback, setUseImgFallback] = useState(false);

  // if the original src prop changes, try to set it (or placeholder)
  useEffect(() => {
    const next = sanitize(src) ?? PLACEHOLDER;
    if (next !== displaySrc) {
      setDisplaySrc(next);
      setUseImgFallback(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // debug log
  useEffect(() => {
    // Only log in dev
    if (process.env.NODE_ENV !== "production") {
      console.log("[BannerImage] src prop:", src, "| using:", displaySrc);
    }
  }, [src, displaySrc]);

  // Handler for next/image errors
  const handleNextImageError = () => {
    if (displaySrc !== PLACEHOLDER) {
      // try placeholder first
      setDisplaySrc(PLACEHOLDER);
      // Also set a small timeout to switch to <img> fallback if placeholder fails to load
      setTimeout(() => setUseImgFallback(true), 800);
    } else {
      // placeholder failed too -> use <img> fallback
      setUseImgFallback(true);
    }
  };

  // If we decided to fallback to plain <img>, render that
  if (useImgFallback) {
    return (
      // plain img is less strict and will always show something
      // added onError just to be safe (replace with placeholder)
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={displaySrc}
        alt={alt || "Banner"}
        className="object-cover w-full h-full"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (target.src !== PLACEHOLDER) target.src = PLACEHOLDER;
        }}
      />
    );
  }

  // Prefer next/image (keeps layout/fill behavior)
  return (
    <Image
      src={displaySrc}
      alt={alt || "Banner"}
      fill
      className="object-cover"
      priority
      unoptimized
      // note: next/image onError gets called with a synthetic event in modern Next.
      // it should trigger our handler — but we also have the img fallback as backup.
      onError={handleNextImageError}
    />
  );
}

export default function BannerCarousel() {
  const swiperRef = useRef<any>(null);
  const id = useId();
  const t = useTranslations("home");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { banners, isLoading } = useBanners();

  useEffect(() => {
    // detect device only on client
    if (typeof window !== "undefined") {
      const check = () => setIsMobile(window.innerWidth < 768);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }
  }, []);

  const prevClass = `swiper-button-prev-${id}`;
  const nextClass = `swiper-button-next-${id}`;

  const PLACEHOLDER_BANNERS = [
    {
      id: "placeholder-1",
      name: "Добро пожаловать в Carato",
      image: "/images/banner-placeholder.jpg",
      redirectTo: "#",
    },
  ];

  const bannerItems =
    banners?.length > 0
      ? banners.map((item) => ({
          id: String(item.id ?? Math.random()),
          name: item.text ?? "Без названия",
          image: isMobile ? item.mobileImage : item.desktopImage,
          redirectTo: item.redirectTo ?? "#",
        }))
      : PLACEHOLDER_BANNERS;

  // Debugging info: print banners array (dev only)
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[BannerCarousel] banners from hook:", banners);
      console.log("[BannerCarousel] bannerItems:", bannerItems);
    }
  }, [banners, bannerItems]);

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
                {/* Use robust BannerImage component */}
                <BannerImage src={item.image} alt={item.name} />

                <div
                  className="
                    absolute inset-0 
                    flex flex-col justify-center items-start
                    max-w-[65%] md:max-w-[50%]
                    px-4 
                    md:px-0 md:top-1/5 md:right-[8%] md:left-auto
                    md:items-start md:justify-start
                    gap-4 md:gap-8
                  "
                >
                  <h1 className="text-lg md:text-[40px] font-light text-start md:leading-[60px] text-white md:text-black">
                    {item.name}
                  </h1>

                  <Button
                    onClick={() => {
                      if (item.redirectTo && item.redirectTo !== "#") {
                        window.open(item.redirectTo, "_blank");
                      }
                    }}
                    className="hidden md:block bg-black text-white w-[280px] h-[52px] text-sm uppercase font-normal rounded-md hover:text-black border border-black hover:bg-white z-[1000] cursor-pointer"
                  >
                    {t("learnMoreBanner")}
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
            className="rounded-full bg-white cursor-pointer"
            style={{
              width: activeIndex === index ? 24 : 8,
              height: 8,
              opacity: activeIndex === index ? 1 : 0.6,
            }}
            onClick={() => {
              if (swiperRef.current) {
                swiperRef.current.slideToLoop(index);
                setActiveIndex(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
