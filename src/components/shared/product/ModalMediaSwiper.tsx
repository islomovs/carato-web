/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useId, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaItem, { MediaItemT } from "./MediaItem";
import { Skeleton } from "@/components/ui/skeleton";

interface ModalMediaSwiperProps {
  media: MediaItemT[];
  startIndex?: number;
  onClose?: () => void;
  onClick?: () => void;
  loading?: boolean;
}

export default function ModalMediaSwiper({
  media,
  startIndex = 0,
  onClick,
  loading = false,
}: ModalMediaSwiperProps) {
  const swiperRef = useRef<any>(null);
  const id = useId();
  const prevClass = `swiper-button-prev-${id}`;
  const nextClass = `swiper-button-next-${id}`;
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
    // Pause all videos except active one
    videoRefs.current.forEach((video, i) => {
      if (video && i !== swiper.realIndex) video.pause();
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center md:gap-6 items-center">
      <Swiper
        modules={[Navigation, Keyboard]}
        navigation={{ prevEl: `.${prevClass}`, nextEl: `.${nextClass}` }}
        slidesPerView={1}
        initialSlide={startIndex}
        keyboard={{ enabled: true }}
        loop={media.length > 1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        className="w-full h-full"
      >
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          media.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative w-full h-full flex items-center justify-center">
                <MediaItem media={item} fullHeight onClick={onClick} />
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>

      {/* Pagination + arrows */}
      <div className="absolute left-auto right-auto bottom-4 flex items-center gap-2 justify-center z-20">
        <button
          className={`${prevClass} cursor-pointer hidden md:flex items-center justify-center w-14 h-14 ml-8 md:ml-[32px]`}
        >
          <ChevronLeft className="w-[20px] h-[20px] text-black" />
        </button>

        {media.map((_, index) => (
          <motion.span
            key={index}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="rounded-full bg-black/60 cursor-pointer"
            style={{
              width: activeIndex === index ? 24 : 8,
              height: 8,
              opacity: activeIndex === index ? 1 : 0.4,
            }}
            onClick={() => {
              swiperRef.current?.slideToLoop(index);
              setActiveIndex(index);
            }}
          />
        ))}

        <button
          className={`${nextClass} cursor-pointer hidden md:flex items-center justify-center w-14 h-14 mr-8 md:mr-[32px]`}
        >
          <ChevronRight className="w-[20px] h-[20px] text-black" />
        </button>
      </div>
    </div>
  );
}
