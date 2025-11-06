"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { Button } from "../../ui/button";
import { useState } from "react";
import LeaveFeedbackModal from "./LeaveFeedbackModal";
import { useTranslations } from "next-intl";

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

export default function FeedbackSection({
  overallRating,
  totalReviews,
  feedbacks,
}: Props) {
  const t = useTranslations("product");
  const [openFeedback, setOpenFeedback] = useState(false);
  return (
    <div className="flex flex-col gap-8">
      <LeaveFeedbackModal open={openFeedback} onOpenChange={setOpenFeedback} />
      {/* ----- SUMMARY BLOCK ----- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
        <div className="w-full flex flex-row justify-between md:flex-col md:gap-1">
          <div className="flex items-center gap-2">
            <span className="font-[400] text-lg md:text-[32px]">
              {overallRating.toFixed(1)}
            </span>
            <div className="flex gap-1 md:gap-[10px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={`${i < Math.round(overallRating) ? "fill-[#FAC515] text-[#FAC515]" : "text-[#FAC515]"} `}
                  strokeWidth={i < Math.round(overallRating) ? 0 : 1.5}
                />
              ))}
            </div>
          </div>
          <span className="font-[500] text-[14px]">
            {t("basedOnTotalReviews", { totalReviews })}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => setOpenFeedback(true)}
          className="text-[12px] font-normal rounded-md uppercase w-full md:w-fit py-2 px-2 self-center border-black cursor-pointer"
        >
          {t("leaveFeedback")}
        </Button>
      </div>

      {/* ----- FEEDBACK ITEMS ----- */}
      <div className="flex flex-col">
        {feedbacks.map((f) => (
          <div key={f.id} className="border-t border-[#EEF2F6] py-3 md:py-4">
            {/* User info + stars */}
            <div className="flex items-center gap-2">
              <span className="font-[500] text-[16px]">{f.userName}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${i < f.rating ? "fill-[#FAC515] text-[#FAC515]" : "text-[#FAC515]"} `}
                    strokeWidth={i < f.rating ? 0 : 1.5}
                  />
                ))}
              </div>
            </div>
            <div className="mt-0.5 md:mt-2 font-[300] text-[12px]">
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
              <div className="flex gap-2 mt-3 md:mt-5">
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
            <div className="mt-3 md:mt-5">
              <div className="font-medium text-base">{f.title}</div>
              <div className="font-light text-xs text-[#4B5565] mt-0.5 md:mt-2">
                {f.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
