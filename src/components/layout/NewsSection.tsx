"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useNews } from "@/hooks/useNews";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewsSection() {
  const t = useTranslations("home");
  const router = useRouter();

  const locale =
    typeof window !== "undefined"
      ? localStorage.getItem("locale") || "ru"
      : "ru";

  const page = 1;
  const size = 6;
  const { news, loading, error } = useNews(locale, page, size);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;

  const PLACEHOLDER = "/images/news-placeholder.png";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
    };
    const localeMap: Record<string, string> = {
      ru: "ru-RU",
      uz: "uz-Latn-UZ",
      en: "en-US",
    };
    return new Intl.DateTimeFormat(
      localeMap[locale] || "ru-RU",
      options
    ).format(date);
  };

  return (
    <div className="flex flex-col w-full my-20 md:my-40 overflow-hidden md:px-8">
      <h1 className="text-[28px] md:text-[52px] mx-4 md:mx-0 font-light text-black w-fit self-start">
        {t("news")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-[52px] gap-6 md:gap-8 w-full">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col w-full px-4">
                <div className="relative w-full h-[240px] md:h-[618px]">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="flex flex-col mt-2 md:mt-3 px-4 md:px-0 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          : news?.slice(0, 6).map((item) => {
              const imageSrc =
                (isMobile ? item.mobileImage : item.desktopImage) ||
                item.desktopImage ||
                item.mobileImage ||
                PLACEHOLDER;

              return (
                <div key={item.id} className="flex flex-col w-full">
                  <div className="relative w-full h-[240px] md:h-[618px] flex-shrink-0">
                    <Image
                      src={imageSrc}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="flex flex-col items-start mt-2 md:mt-3 px-4 md:px-0">
                    <p className="text-[#9AA4B2] text-[14px] font-light line-clamp-1">
                      {formatDate(item.createdTime)}
                    </p>
                    <p className="text-black text-[18px] font-medium mt-1 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[#000000] text-[14px] font-light mt-1 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>

      {/* Button */}
      <div className="mx-4 md:mx-0">
        <Button
          variant="outline"
          onClick={() => router.push("/news")}
          className="mt-6 md:mt-20 w-full md:w-[280px] h-[36px] md:h-[52px] text-sm uppercase font-normal rounded-md bg-white text-black border border-black hover:bg-black hover:!text-white transition-colors duration-200 cursor-pointer md:self-center"
        >
          {t("seeAll")}
        </Button>
      </div>
    </div>
  );
}
