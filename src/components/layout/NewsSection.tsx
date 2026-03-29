"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useNews } from "@/hooks/useNews";
import { useRouter } from "next/navigation";
import NewsCard from "@/components/shared/NewsCard";
import NewsSkeleton from "@/components/shared/NewsSkeleton";

export default function NewsSection() {
  const t = useTranslations("home");
  const router = useRouter();

  const page = 1;
  const size = 6;
  const { news, loading, error } = useNews({page, size: size});

  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div className="flex flex-col w-full my-20 md:my-40 overflow-hidden md:px-8">
      <h1 className="text-[28px] md:text-[52px] mx-4 md:mx-0 font-light text-black w-fit self-start">
        {t("news")}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-[52px] gap-6 md:gap-8 w-full">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <NewsSkeleton key={i} />)
          : news
              .slice(0, 6)
              .map((item) => <NewsCard key={item.id} item={item} />)}
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
