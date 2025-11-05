"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import ProductSizeSelector from "./ProductSizeSelector";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import SizeModals from "./SizeModals";

export default function ProductInfo() {
  const t = useTranslations("product");
  const rating = 4;
  const totalStars = 5;

  const [openNotify, setOpenNotify] = useState(false);
  const [openDetermine, setOpenDetermine] = useState(false);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* ---- Блок информации ---- */}
      <div className="flex flex-col justify-start items-start gap-2 w-full">
        <h2 className="font-light text-base text-[#697586]">БРАСЛЕТЫ</h2>
        <h1 className="font-normal text-[28px]">
          Браслет с черно-синим кристалом, 18к золота
        </h1>
        <div className="flex items-center">
          <div className="flex gap-[4px]">
            {Array.from({ length: totalStars }).map((_, index) => {
              const filled = index < rating;
              return (
                <Star
                  key={index}
                  size={20}
                  className={`${
                    filled ? "fill-[#FAC515] text-[#FAC515]" : "text-[#FAC515]"
                  }`}
                  strokeWidth={filled ? 0 : 1.5}
                />
              );
            })}
          </div>
          <span className="font-light text-sm underline ml-2">4 отзыва</span>
        </div>
      </div>

      {/* ---- Цены ---- */}
      <div className="flex items-center">
        <span className="font-medium text-2xl">242 542 325 UZS</span>
        <span className="font-medium text-base text-[#9AA4B2] line-through ml-3">
          242 542 325 UZS
        </span>
        <span className="font-normal text-xs text-[#FEFDF0] bg-[#F04438] py-1 px-2 rounded-[2px] ml-3">
          -50%
        </span>
      </div>

      {/* ---- Размеры ---- */}
      <ProductSizeSelector
        onOpenNotify={() => setOpenNotify(true)}
        onOpenDetermine={() => setOpenDetermine(true)}
      />

      {/* ---- Кнопки ---- */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 w-full">
          <Button className="bg-black text-white flex-1 h-[52px] text-sm uppercase font-normal rounded-md hover:text-black border border-black hover:bg-white cursor-pointer">
            {t("addToCart")}
          </Button>
          <Button
            variant="ghost"
            className="bg-white text-black w-[52px] h-[52px] font-normal rounded-md border border-black cursor-pointer"
          >
            <Image
              src="/icons/heart.svg"
              alt="Add to favorites"
              width={20}
              height={20}
            />
          </Button>
          <Button
            variant="ghost"
            className="bg-white text-black w-[52px] h-[52px] font-normal rounded-md border border-black cursor-pointer"
          >
            <Image src="/icons/share.svg" alt="Share" width={20} height={20} />
          </Button>
        </div>

        <Button
          variant="ghost"
          className="bg-white hover:bg-black text-black hover:text-white w-full h-[52px] font-normal rounded-md border border-black cursor-pointer uppercase transition-colors duration-200"
        >
          Купить в 1 клик
        </Button>
      </div>

      <div className="flex justify-between items-center w-full">
        <span className="font-normal text-sm">Примерные даты доставки</span>
        <span className="font-normal text-sm">20 - 23 сентября</span>
      </div>

      {/* ---- Модалки ---- */}
      <SizeModals
        openNotify={openNotify}
        setOpenNotify={setOpenNotify}
        openDetermine={openDetermine}
        setOpenDetermine={setOpenDetermine}
      />
    </div>
  );
}
