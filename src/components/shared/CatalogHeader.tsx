"use client";
import { RefObject } from "react";

export default function CatalogHeader({
  refTitle,
}: {
  refTitle: RefObject<HTMLDivElement | null>;
}) {
  return (
    <header className="w-full">
      <div
        ref={refTitle}
        className="flex items-center justify-center my-[52px]"
      >
        <h1 className="text-[28px] leading-[34px] text-center font-[400]">
          Каталог товаров
        </h1>
      </div>
    </header>
  );
}
