"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SwiperNavigationProps {
  prevClass?: string;
  nextClass?: string;
}

export default function SwiperNavigation({
  prevClass,
  nextClass,
}: SwiperNavigationProps) {
  return (
    <div className="hidden md:absolute w-full top-1/2 -translate-y-1/2 z-20 justify-between">
      {/* Prev Button */}
      <button
        className={`${prevClass} cursor-pointer ml-8 flex items-center justify-center w-14 h-14`}
      >
        <ChevronLeft className="w-[20px] h-[20px] text-black" />
      </button>

      {/* Next Button */}
      <button
        className={`${nextClass} cursor-pointer mr-8 flex items-center justify-center w-14 h-14`}
      >
        <ChevronRight className="w-[20px] h-[20px] text-black" />
      </button>
    </div>
  );
}
