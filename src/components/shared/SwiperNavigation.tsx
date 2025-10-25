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
    <div className="hidden absolute inset-0 md:flex items-center justify-between z-20 pointer-events-none">
      {/* Prev Button */}
      <button
        className={`${prevClass} cursor-pointer flex items-center justify-center w-14 h-14 ml-8 md:ml-[32px] pointer-events-auto`}
      >
        <ChevronLeft className="w-[20px] h-[20px] text-black" />
      </button>

      {/* Next Button */}
      <button
        className={`${nextClass} cursor-pointer flex items-center justify-center w-14 h-14 mr-8 md:mr-[32px] pointer-events-auto`}
      >
        <ChevronRight className="w-[20px] h-[20px] text-black" />
      </button>
    </div>
  );
}
