import { NewsItem } from "@/services/news";
import Image from "next/image";
import { useLocale } from "next-intl";
import { formatNewsDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function NewsCard({ item }: { item: NewsItem }) {
  const PLACEHOLDER = "/images/news-placeholder.png";
  const router = useRouter();

  const imageSrc = item.mobileImage || item.desktopImage || PLACEHOLDER;
  const locale = useLocale();

  return (
    <div
      onClick={() => router.push(`/${locale}/news/${item.slug}`)}
      className="hover:opacity-90 transition cursor-pointer flex flex-col w-full"
    >
      <div className="relative w-full h-[240px] md:h-[618px]">
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="px-4 md:px-0 mt-2 md:mt-3 text-start">
        <p className="text-[#9AA4B2] text-[14px] font-light">
          {formatNewsDate(item.createdTime, locale)}
        </p>
        <p className="text-black text-[18px] font-medium mt-1">{item.title}</p>
        <p className="text-black text-[14px] font-light leading-[20px] mt-[4px] line-clamp-1">
          {item.description}
        </p>
      </div>
    </div>
  );
}
