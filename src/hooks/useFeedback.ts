"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FeedbackResponse,
  getProductFeedbackBySlug,
  submitProductFeedback,
} from "@/services/feedback";
import { useLocale } from "use-intl";

export const useFeedback = (
  slug: string,
  page: number = 1,
  pageSize: number = 10
) => {
  const locale = useLocale();

  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  const fetchFeedback = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      const res = await getProductFeedbackBySlug(slug, locale, page, pageSize);
      setData(res);
    } catch (err) {
      console.error("❌ Failed to fetch feedback:", err);
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, [slug, locale, page, pageSize]);

  useEffect(() => {
    if (!slug) return;
    fetchFeedback();
  }, [fetchFeedback, refreshFlag]);

  const createFeedback = async (payload: {
    product: string;
    text: string;
    rating: number;
  }) => {
    try {
      await submitProductFeedback(payload, locale);

      // Re-fetch feedback list after successful submission
      setRefreshFlag((x) => x + 1);
    } catch (err) {
      console.error("❌ Failed to create feedback:", err);
      setError("Failed to submit feedback");
    }
  };

  return {
    feedback: data?.content ?? [],
    pagination: {
      totalPages: data?.totalPages ?? 0,
      totalElements: data?.totalElements ?? 0,
      currentPage: data?.number ?? 0,
      pageSize: data?.size ?? pageSize,
    },
    loading,
    error,
    createFeedback,
    raw: data,
  };
};
