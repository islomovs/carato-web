/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "../../ui/button";
import { useState } from "react";
import LeaveFeedbackModal from "./LeaveFeedbackModal";
import { useTranslations } from "next-intl";
import { useFeedback } from "@/hooks/useFeedback";
import { Skeleton } from "@/components/ui/skeleton"; // shadcn skeleton import
import AuthModal from "../auth-modal";
import { getTokenPair } from "@/lib/axios/instance";
import { useAuthModalStore } from "@/lib/authModalStore";

export default function FeedbackSection({
  overallRating,
  totalReviews,
  slug,
  loading,
}: {
  overallRating: number;
  totalReviews: number;
  slug: string;
  loading: boolean;
}) {
  const t = useTranslations("product");
  const [openFeedback, setOpenFeedback] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { openAuth } = useAuthModalStore();

  const {
    feedback,
    pagination,
    loading: feedbackLoading,
    error: feedbackError,
  } = useFeedback(slug, page, pageSize);

  const totalPages = pagination.totalPages;

  // Normalize API response
  const formattedFeedbacks = feedback.map((item, index) => ({
    id: index + 1,
    userName: item.user.fullName,
    rating: item.rating,
    date: item.createdTime,
    title: "",
    description: item.text,
    media:
      item.media && item.media.length > 0
        ? item.media.map((m, i) => ({
            id: i + 1,
            src: m.src,
            type: m.src.endsWith(".mp4") ? "video" : "image",
          }))
        : [
            {
              id: 1,
              src: "/images/category-placeholder.png",
              type: "image",
            },
          ],
  }));

  if (!slug) return null;

  const isAuthenticated = Boolean(getTokenPair().token);

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        {/* Summary skeleton */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
          <div className="w-full flex flex-row justify-between md:flex-col md:gap-1">
            <div className="flex items-center gap-2">
              <Skeleton className="w-12 h-8" />
              <div className="flex gap-1 md:gap-[10px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-6 h-6 rounded-full" />
                ))}
              </div>
            </div>
            <Skeleton className="w-40 h-4 mt-2" />
          </div>

          <Skeleton className="w-full md:w-40 h-10 rounded-md" />
        </div>

        {/* Feedback list skeleton */}
        <div className="flex flex-col">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="border-t border-[#EEF2F6] py-3 md:py-4 flex flex-col gap-2"
            >
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-40 h-3" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-8">
      <LeaveFeedbackModal
        open={openFeedback}
        onOpenChange={setOpenFeedback}
        productSlug={slug}
      />

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
                  className={`${
                    i < Math.round(overallRating)
                      ? "fill-[#FAC515] text-[#FAC515]"
                      : "text-[#FAC515]"
                  } `}
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
          onClick={() => {
            if (!isAuthenticated) {
              openAuth();
              return;
            }
            setOpenFeedback(true);
          }}
          className="text-[12px] font-normal rounded-md uppercase w-full md:w-fit py-2 px-2 self-center border-black cursor-pointer"
        >
          {t("leaveFeedback")}
        </Button>
      </div>

      {/* ----- FEEDBACK LIST ----- */}
      <div className="flex flex-col">
        {feedbackLoading &&
          Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="border-t border-[#EEF2F6] py-3 md:py-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="w-24 h-4 rounded" />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="w-4 h-4 rounded" />
                  ))}
                </div>
              </div>
              <Skeleton className="w-40 h-3 mt-1" />
              <div className="flex gap-2 mt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-16 h-16 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="w-full h-4 mt-2" />
              <Skeleton className="w-full h-4 mt-1" />
            </div>
          ))}

        {feedbackError && <div className="text-red-500">{feedbackError}</div>}

        {!feedbackLoading &&
          formattedFeedbacks.map((f) => (
            <div key={f.id} className="border-t border-[#EEF2F6] py-3 md:py-4">
              {/* User + stars */}
              <div className="flex items-center gap-2">
                <span className="font-[500] text-[16px]">{f.userName}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < f.rating
                          ? "fill-[#FAC515] text-[#FAC515]"
                          : "text-[#FAC515]"
                      } `}
                      strokeWidth={i < f.rating ? 0 : 1.5}
                    />
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="mt-0.5 md:mt-2 font-[300] text-[12px]">
                {(() => {
                  const d = new Date(f.date);
                  return `${d.getDate()} ${d.toLocaleString("ru-RU", {
                    month: "long",
                  })} ${d.getFullYear()}`;
                })()}
              </div>

              {/* Media */}
              {f.media && f.media.length > 0 && (
                <div className="flex gap-2 mt-3 md:mt-5">
                  {f.media.map((m: any) => (
                    <div
                      key={m.id}
                      className="w-16 h-16 flex-shrink-0 overflow-hidden flex items-center justify-center"
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
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Text */}
              <div className="mt-3 md:mt-5">
                <div className="font-light text-xs text-[#4B5565]">
                  {f.description}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* ----- PAGINATION ----- */}
      {totalPages > 1 && (
        <div className="hidden md:flex justify-center mt-[52px]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-2 disabled:opacity-30"
            >
              <ChevronLeft />
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-2 disabled:opacity-30"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
      <AuthModal
        initialMode="phone"
      />
    </div>
  );
}
