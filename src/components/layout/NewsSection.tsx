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
    <div className="flex flex-col w-full my-20 md:my-40 overflow-hidden md:px-8">
      <h1 className="text-[28px] md:text-[52px] mx-4 md:mx-0 font-light text-black w-fit self-start">
        {t("news")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-[52px] gap-6 md:gap-8 w-full">
        {news.slice(0, 6).map((item) => (
          <div key={item.id} className="flex flex-col w-full">
            <div className="relative w-full h-[240px] md:h-[618px] flex-shrink-0">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col items-start mt-2 md:mt-3 px-4 md:px-0">
              <p className="text-[#9AA4B2] text-[14px] font-light line-clamp-1">
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

      <div className="mx-4 md:mx-0">
        <Button
          variant="outline"
          className="mt-6 md:mt-20 w-full md:w-[280px] h-[36px] md:h-[52px] text-sm uppercase font-normal rounded-md bg-white text-black border border-black hover:bg-black hover:!text-white transition-colors duration-200 cursor-pointer md:self-center"
        >
          {t("seeAll")}
        </Button>
      </div>
    </div>
  );
}
