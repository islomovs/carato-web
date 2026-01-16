/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useId, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MediaItemT } from "./MediaItem";
import SwiperNavigation from "../SwiperNavigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function FullscreenViewer({
  media,
  startIndex = 0,
  onClose,
  loading = false,
}: {
  media: MediaItemT[];
  startIndex?: number;
  onClose: () => void;
  loading: boolean;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const swiperRef = useRef<any>(null);
  const id = useId();
  const prevClass = `swiper-button-prev-${id}`;
  const nextClass = `swiper-button-next-${id}`;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white">
      <div className="relative w-full h-full flex flex-col items-center pt-[50px] md:pt-[80px]">
        <SwiperNavigation prevClass={prevClass} nextClass={nextClass} />

        <div className="relative h-full md:aspect-square w-full max-w-[90vh] max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-160px)]">
          <Swiper
            modules={[Navigation, Keyboard]}
            navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
            slidesPerView={1}
            initialSlide={startIndex}
            keyboard={{ enabled: true }}
            loop={media.length > 1}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full h-full"
          >
            {loading ? (
              <Skeleton className="w-full h-full rounded-lg" />
            ) : (
              media.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="w-full h-full flex items-center justify-center">
                    {item.type === "image" ? (
                      <Image
                        src={item.src}
                        alt={item.alt || ""}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <video
                        src={item.src}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-1 my-8">
          {media.map((_, index) => (
            <motion.span
              key={index}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="rounded-full bg-black/70 cursor-pointer"
              style={{
                width: activeIndex === index ? 24 : 8,
                height: 8,
                opacity: activeIndex === index ? 1 : 0.5,
              }}
              onClick={() => {
                swiperRef.current?.slideToLoop(index);
                setActiveIndex(index);
              }}
            />
          ))}
        </div>
        {/* Close button */}
        <div className="absolute right-2 top-[14px] md:right-8 md:top-8 z-50">
          <Button
            variant="ghost"
            className="w-[52px] h-[52px] rounded-none bg-white cursor-pointer"
            onClick={onClose}
          >
            <Image
              src="/icons/x-close.svg"
              width={20}
              height={20}
              alt="close"
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
