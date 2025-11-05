"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

type Feedback = {
  id: number;
  userName: string;
  rating: number;
  date: string;
  media?: { id: number; src: string; type: "image" | "video" }[];
  title: string;
  description: string;
};

type Props = {
  overallRating: number;
  totalReviews: number;
  feedbacks: Feedback[];
};

function Stars({
  count,
  size = 24,
  gap = 4,
}: {
  count: number;
  size?: number;
  gap?: number;
}) {
  return (
    <div className={`flex gap-[${gap}px]`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${i < count ? "fill-[#FAC515] text-[#FAC515]" : "text-[#FAC515]"} `}
          strokeWidth={i < count ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

export default function FeedbackSection({
  overallRating,
  totalReviews,
  feedbacks,
}: Props) {
  return (
    <div className="flex flex-col gap-8">
      {/* ----- SUMMARY BLOCK ----- */}
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-[400] text-[32px]">
              {overallRating.toFixed(1)}
            </span>
            <Stars count={Math.round(overallRating)} size={24} gap={10} />
          </div>
          <span className="font-[500] text-[14px]">
            на основе {totalReviews} отзывов
          </span>
        </div>
        <Button
          variant="outline"
          className="text-[12px] font-normal uppercase py-2 px-2 self-center border-black cursor-pointer"
        >
          Оставить отзыв
        </Button>
      </div>

      {/* ----- FEEDBACK ITEMS ----- */}
      <div className="flex flex-col gap-5">
        {feedbacks.map((f) => (
          <div key={f.id} className="border-t border-[#EEF2F6] pt-4">
            {/* User info + stars */}
            <div className="flex items-center gap-2">
              <span className="font-[500] text-[16px]">{f.userName}</span>
              <Stars count={f.rating} size={16} gap={2} />
            </div>
            <div className="mt-2 font-[300] text-[12px]">
              {(() => {
                const d = new Date(f.date);
                const day = d.getDate();
                const month = d.toLocaleString("ru-RU", { month: "long" });
                const year = d.getFullYear();
                return `${day} ${month} ${year}`;
              })()}
            </div>

            {/* Media */}
            {f.media && (
              <div className="flex gap-2 mt-5">
                {f.media.map((m) => (
                  <div
                    key={m.id}
                    className="w-16 h-16 rounded-2xl overflow-hidden"
                  >
                    {m.type === "image" ? (
                      <Image
                        src={m.src}
                        alt="media"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <video
                        src={m.src}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Title + description */}
            <div className="mt-5">
              <div className="font-[500] text-[16px]">{f.title}</div>
              <div className="font-[300] text-[12px] text-[#4B5565] mt-2">
                {f.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
