"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { RefObject } from "react";

interface Props {
  refBar: RefObject<HTMLDivElement | null>;
  total: number;
}

export default function FilterBar({ refBar, total }: Props) {
  return (
    <>
      <div
        ref={refBar}
        className="sticky top-16 z-40 border-t border-b border-[#EEF2F6] bg-white"
      >
        <div className="w-full flex items-center justify-between px-8 py-[22px]">
          <Button
            variant="outline"
            className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-[400] h-auto border-[#E3E8EE] cursor-pointer"
          >
            <Image
              src="/icons/settings.svg"
              alt="Settings"
              width={20}
              height={20}
            />
            <span>ФИЛЬТРЫ</span>
          </Button>
          <div className="text-[14px] font-[300]">
            {total.toLocaleString("ru-RU")} ИЗДЕЛИЙ
          </div>
        </div>
      </div>
    </>
  );
}
