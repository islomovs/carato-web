"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { getMyFeedbacks, MyFeedback } from "@/services/feedback";
import MyFeedbackCard from "./MyFeedbackCard";

export default function ReviewsBlock() {
  const t = useTranslations("profile");
  const locale = useLocale();
  const [feedbacks, setFeedbacks] = useState<MyFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyFeedbacks(1, 20, locale)
      .then((data) => setFeedbacks(data))
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[910px] mt-[52px] md:mt-[52px]"
    >
      {loading ? (
        // skeleton shimmer
        <div className="flex flex-col gap-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="py-5 border-b border-[#EEF2F6] animate-pulse"
            >
              <div className="h-4 bg-gray-100 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-430px)]">
          <Image
            src="/icons/file-check.svg"
            alt="Empty reviews"
            width={80}
            height={80}
          />
          <p className="mt-3 text-xl font-medium">{t("emptyReviewsMessage")}</p>
          <p className="mt-3 text-sm font-normal">
            {t("emptyReviewsDescription")
              .split("\n")
              .map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
          </p>
        </div>
      ) : (
        // newest first (API already returns desc, but just in case)
        <div className="md:px-0 px-0">
          {[...feedbacks].map((fb, i) => (
            <MyFeedbackCard key={i} feedback={fb} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
