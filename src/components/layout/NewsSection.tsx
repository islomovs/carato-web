"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
}

interface NewsSectionProps {
  news: NewsItem[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col w-full my-20 md:my-40 md:mx-8">
      <h1 className="text-[28px] md:text-[52px] font-light text-black mx-4 md:mx-0 w-fit self-start">
        {t("news")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-[52px] gap-6 md:gap-5 w-full">
        {news.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-start w-full h-[700px]"
          >
            <div className="relative w-full h-[618px]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col mx-4 items-start w-full">
              <p className="text-[#9AA4B2] text-[14px] font-light mt-2 line-clamp-1">
                {item.date}
              </p>
              <p className="text-black text-[18px] font-medium mt-1 line-clamp-1">
                {item.title}
              </p>
              <p className="text-[#000000] text-[14px] font-light mt-1 line-clamp-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-6 md:mt-20 self-center w-[280px] h-[52px] text-sm uppercase font-normal rounded-md 
          bg-white text-black border border-black hover:bg-black hover:!text-white 
          transition-colors duration-200 cursor-pointer mt-8"
      >
        {t("seeAll")}
      </Button>
    </div>
  );
}
