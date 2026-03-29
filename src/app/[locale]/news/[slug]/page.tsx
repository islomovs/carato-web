"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useNews } from "@/hooks/useNews";
import { useParams } from "next/navigation";
import NewsCard from "@/components/shared/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function SingleNewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const params = useParams();

  const slug = params.slug as string;

  const { news, singleNews, loading, error } = useNews({ slug });

if (loading) {
  return (
    <div className="w-full px-4 md:px-8">
      {/* MOBILE SKELETON */}
      <div className="md:hidden mt-8 space-y-4">
        <Skeleton className="h-8 w-full" /> {/* Title */}
        <Skeleton className="h-6 w-5/6" /> {/* Subtitle */}
        <Skeleton className="h-4 w-1/3 mt-6" /> {/* Date */}
        <Skeleton className="h-4 w-1/4 mt-1" /> {/* Author */}
        <Skeleton className="w-full h-60 mt-8" /> {/* Image */}
      </div>

      {/* DESKTOP TOP BLOCK SKELETON */}
      <div className="hidden md:flex gap-[20px] mt-8">
        <div className="w-[594px] flex flex-col space-y-4">
          <Skeleton className="h-14 w-full" /> {/* Title */}
          <Skeleton className="h-10 w-5/6" /> {/* Subtitle */}
          <Skeleton className="h-5 w-1/4 mt-12" /> {/* Date */}
          <Skeleton className="h-5 w-1/5 mt-1" /> {/* Author */}
        </div>
        <Skeleton className="flex-1 h-[500px]" /> {/* Right Image */}
      </div>

      {/* DESCRIPTION SKELETON */}
      <div className="mt-12 mb-20">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-5/6" />
      </div>

      {/* LATEST NEWS SKELETON */}
      <div className="mt-[48px] md:mt-[160px] space-y-6">
        <Skeleton className="h-10 w-1/3" /> {/* Latest News Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-60 w-full" /> {/* Card image */}
              <Skeleton className="h-5 w-5/6" /> {/* Card title */}
              <Skeleton className="h-4 w-4/6" /> {/* Card subtitle */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}  if (error || !singleNews)
    return <div className="p-4 text-red-500">{error}</div>;

  const item = singleNews;

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
    }).format(new Date(date));

  const imageSrc =
    item.mobileImage || item.desktopImage || "/images/news-placeholder.png";

  return (
    <div className="w-full">
      {/* MOBILE */}
      <div className="md:hidden px-4 mt-8">
        {/* Title */}
        <h1 className="text-[24px] leading-[34px] font-normal">{item.title}</h1>

        {/* Subtitle */}
        <p className="mt-[8px] text-[18px] leading-[26px] font-light">
          {item.description}
        </p>

        {/* Date */}
        <p className="mt-[24px] text-[12px] leading-[18px] font-light text-gray-500">
          {formatDate(item.createdTime)}
        </p>

        {/* Author */}
        <p className="mt-[2px] text-[12px] leading-[18px] font-light text-gray-500">
          {t("authorPrefix")} {item.author}
        </p>
      </div>

      {/* Image */}
      <div className="mt-[32px] md:mt-0 md:hidden">
        <div className="relative w-full h-[240px] md:h-[500px]">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* DESKTOP TOP BLOCK */}
      <div className="hidden md:flex gap-[20px]">
        {/* LEFT */}
        <div className="w-[594px] flex flex-col justify-center px-8">
          <h1 className="text-[52px] leading-[72px] font-normal">
            {item.title}
          </h1>

          <p className="mt-[16px] text-[32px] leading-[44px] font-light">
            {item.description}
          </p>

          <p className="mt-[48px] text-[18px] leading-[26px] font-light text-gray-500">
            {formatDate(item.createdTime)}
          </p>

          <p className="mt-[4px] text-[18px] leading-[26px] font-light text-gray-500">
            {t("authorPrefix")} {item.author}
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex-1 relative h-[500px]">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="px-4 md:px-8 mt-[48px] md:mt-[80px] mb-20">
        <p className="text-[16px] md:text-[18px] leading-[22px] md:leading-[26px] font-light">
          {item.description}
        </p>
      </div>

      {/* Последние новости / Latest News */}
      <div className="mt-[48px] md:mt-[160px] px-4 md:px-8">
        <h2 className="text-[28px] md:text-[52px] leading-[40px] md:leading-[72px] font-light">
          {t("latestNews")} {/* Add this in news.json */}
        </h2>

        {/* Grid of news */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[24px]">
          {(news || []).slice(0, 3).map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
