"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { MyFeedback } from "@/services/feedback";
import FullscreenViewer from "../product/FullscreenViewer";
import { MediaItemT } from "../product/MediaItem";
import { useState } from "react";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < Math.round(rating)
              ? "fill-[#FAC515] text-[#FAC515]"
              : "text-[#FAC515]"
          }
          strokeWidth={i < Math.round(rating) ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MyFeedbackCard({ feedback }: { feedback: MyFeedback }) {
  const { product, title, description, rating, createdTime, media } = feedback;
  const [fullscreenMedia, setFullscreenMedia] = useState<MediaItemT[] | null>(
    null,
  );
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  const mediaItems: MediaItemT[] = media.map((m, i) => ({
    id: i + 1,
    src: m.image,
    type: m.image.endsWith(".mp4") ? "video" : "image",
    alt: "",
  }));

  const openFullscreen = (index: number) => {
    setFullscreenMedia(mediaItems);
    setFullscreenIndex(index);
  };

  const mobileCard = (
    <div className="flex md:hidden flex-col border-b border-[#EEF2F6] px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-base leading-[22px] text-[#1D1D1F]">
          {product.name}
        </p>
        <Stars rating={rating} />
      </div>

      <p className="mt-[2px] font-light text-xs leading-[18px] text-[#4B5565]">
        {formatDate(createdTime)}
      </p>

      {media.length > 0 && (
        <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto pl-4 pr-4 scrollbar-none">
          {mediaItems.map((m, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-16 h-16 relative rounded overflow-hidden cursor-pointer"
              onClick={() => openFullscreen(i)}
            >
              <Image
                src={m.src}
                alt={`media-${i}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {title && (
        <p className="mt-3 font-medium text-base leading-[22px] text-[#1D1D1F]">
          {title}
        </p>
      )}
      {description && (
        <p className="mt-[2px] font-light text-xs leading-[18px] text-[#1D1D1F]">
          {description}
        </p>
      )}
    </div>
  );

  const desktopCard = (
    <div className="hidden md:flex flex-col border-b border-[#EEF2F6] py-5">
      <div className="flex items-center gap-2">
        <p className="font-medium text-base leading-[22px] text-[#1D1D1F]">
          {product.name}
        </p>
        <Stars rating={rating} />
      </div>

      <p className="mt-[2px] font-light text-xs leading-[18px] text-[#4B5565]">
        {formatDate(createdTime)}
      </p>

      {media.length > 0 && (
        <div className="mt-5 flex gap-2">
          {mediaItems.map((m, i) => (
            <div
              key={i}
              className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0 cursor-pointer"
              onClick={() => openFullscreen(i)}
            >
              <Image
                src={m.src}
                alt={`media-${i}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {title && (
        <p className="mt-5 font-medium text-base leading-[22px] text-[#1D1D1F]">
          {title}
        </p>
      )}
      {description && (
        <p className="mt-[2px] font-light text-xs leading-[18px] text-[#1D1D1F]">
          {description}
        </p>
      )}
    </div>
  );

  return (
    <>
      {mobileCard}
      {desktopCard}
      {fullscreenMedia && (
        <FullscreenViewer
          media={fullscreenMedia}
          startIndex={fullscreenIndex}
          onClose={() => setFullscreenMedia(null)}
          loading={false}
        />
      )}
    </>
  );
}
