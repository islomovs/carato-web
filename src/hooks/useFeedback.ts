"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Feedback,
  submitProductFeedback,
  SubmitFeedbackPayload,
  FeedbackResponse,
} from "@/services/feedback";
import api from "@/lib/axios/instance";
import { useLocale } from "use-intl";
import { uploadFile } from "@/services/upload";
import { MediaFile } from "@/components/shared/feedback/FileUpload";

export const useFeedback = (
  slug: string,
  page: number = 1,
  pageSize: number = 10,
) => {
  const locale = useLocale();

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchFeedback = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<FeedbackResponse>(
        `/api/v1/product-feedbacks/${slug}`,
        {
          params: { page, size: pageSize },
          headers: { "Accept-Language": locale },
        },
      );
      setFeedbacks(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("❌ Failed to fetch feedback:", err);
      setError("Failed to load feedback");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  }, [slug, locale, page, pageSize]);

  useEffect(() => {
    if (!slug) return;
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFeedback, refreshFlag]);

  const createFeedback = async ({
    product,
    title,
    description,
    rating,
    mediaFiles = [],
  }: {
    product: string;
    title: string;
    description: string;
    rating: number;
    mediaFiles?: MediaFile[];
  }) => {
    setSubmitting(true);
    setError(null);
    try {
      const uploadedMedia = await Promise.all(
        mediaFiles.map(async (mf, index) => {
          console.log(`📎 [useFeedback] uploading file ${index}:`, mf);
          console.log(`📎 [useFeedback] mf.file:`, mf.file);
          const url = await uploadFile(mf.file);
          console.log(`✅ [useFeedback] uploaded file ${index}:`, url);
          return { media: url, sortOrder: index };
        }),
      );
      console.log("📦 [useFeedback] uploadedMedia:", uploadedMedia);
      const payload: SubmitFeedbackPayload = {
        product,
        title,
        description,
        rating,
        media: uploadedMedia,
      };

      await submitProductFeedback(payload, locale);
      setRefreshFlag((x) => x + 1);
    } catch (err) {
      console.error("❌ Failed to create feedback:", err);
      setError("Failed to submit feedback");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    feedback: feedbacks,
    pagination: {
      totalPages: totalPages,
      totalElements: totalElements,
      currentPage: page,
      pageSize,
    },
    loading,
    submitting,
    error,
    createFeedback,
    refresh: () => setRefreshFlag((x) => x + 1),
  };
};
