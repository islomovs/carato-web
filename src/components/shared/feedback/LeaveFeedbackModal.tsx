"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileUpload, { MediaFile } from "./FileUpload";
import { useTranslations } from "next-intl";
import RatingStars from "./RatingStars";
import FeedbackInput from "./FeedbackInput";
import { useFeedback } from "@/hooks/useFeedback";
import { toast } from "sonner";

interface LeaveFeedbackModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  productSlug: string;
}

export default function LeaveFeedbackModal({
  open,
  onOpenChange,
  productSlug,
}: LeaveFeedbackModalProps) {
  const t = useTranslations("product");
  const [selectedRating, setSelectedRating] = useState(0);
  const [shortReview, setShortReview] = useState("");
  const [detailedReview, setDetailedReview] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [errors, setErrors] = useState<{
    rating?: string;
    shortReview?: string;
    files?: string;
  }>({});

  const { createFeedback, loading } = useFeedback(productSlug);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (selectedRating === 0) newErrors.rating = t("selectRating");
    if (!shortReview.trim()) newErrors.shortReview = t("shortReviewRequired");
    if (mediaFiles.length > 5) newErrors.files = t("maxFiveFiles");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error(t("pleaseFixErrors"));
      return;
    }

    try {
      await createFeedback({
        product: productSlug,
        rating: selectedRating,
        text: shortReview + (detailedReview ? `\n${detailedReview}` : ""),
        // optionally, handle mediaFiles upload here if backend supports
      });

      toast.success(t("feedbackSubmittedSuccess"));

      // Reset form
      setSelectedRating(0);
      setShortReview("");
      setDetailedReview("");
      setMediaFiles([]);
      setErrors({});

      onOpenChange(false);
    } catch (err) {
      console.error("❌ Failed to submit feedback:", err);
      toast.error(t("feedbackSubmittedError"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-[600px] md:!rounded-2xl flex flex-col md:gap-10 overflow-y-auto md:max-h-[90vh] md:!p-10 !p-0 rounded-none max-w-none !h-[100dvh] md:!h-auto !max-h-none !gap-0 !overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex flex-col h-full w-full">
          <div className="relative h-[64px] border-b border-[#EEF2F6] flex items-center justify-center"></div>

          <div className="flex flex-col gap-8 flex-1 overflow-y-auto px-4 py-8">
            <p className="text-[20px] font-[500]">{t("leaveFeedback")}</p>

            <RatingStars
              selectedRating={selectedRating}
              onChange={(rating) => {
                setSelectedRating(rating);
                if (errors.rating)
                  setErrors((prev) => ({ ...prev, rating: undefined }));
              }}
              error={errors.rating}
            />

            <FeedbackInput
              label={t("shortReview")}
              value={shortReview}
              placeholder={t("enterReview")}
              error={errors.shortReview}
              onChange={(val: string) => {
                setShortReview(val);
                if (errors.shortReview)
                  setErrors((prev) => ({ ...prev, shortReview: undefined }));
              }}
            />

            <FeedbackInput
              label={t("detailedDescription")}
              value={detailedReview}
              placeholder={t("ifYouWantToDescribeTheReview")}
              multiline
              rows={4}
              onChange={setDetailedReview}
            />

            <FileUpload
              onChange={(files) => {
                setMediaFiles(files);
                if (errors.files)
                  setErrors((prev) => ({ ...prev, files: undefined }));
              }}
              error={errors.files}
            />
          </div>

          <div className="p-4 border-t border-[#EEF2F6] bg-white">
            <Button
              className="w-full bg-black text-white h-[52px] text-[14px] uppercase rounded-md"
              onClick={handleSubmit}
              disabled={loading}
            >
              {t("leaveFeedback")}
            </Button>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex flex-col gap-10">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-normal text-black">
              {t("leaveFeedback")}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-10">
            <RatingStars
              selectedRating={selectedRating}
              onChange={(rating) => {
                setSelectedRating(rating);
                if (errors.rating)
                  setErrors((prev) => ({ ...prev, rating: undefined }));
              }}
              error={errors.rating}
            />

            <FeedbackInput
              label={t("shortReview")}
              value={shortReview}
              placeholder={t("enterReview")}
              error={errors.shortReview}
              onChange={(val: string) => {
                setShortReview(val);
                if (errors.shortReview)
                  setErrors((prev) => ({ ...prev, shortReview: undefined }));
              }}
            />

            <FeedbackInput
              label={t("detailedDescription")}
              value={detailedReview}
              placeholder={t("ifYouWantToDescribeTheReview")}
              multiline
              rows={4}
              onChange={setDetailedReview}
            />

            <FileUpload
              onChange={(files) => {
                setMediaFiles(files);
                if (errors.files)
                  setErrors((prev) => ({ ...prev, files: undefined }));
              }}
              error={errors.files}
            />

            <Button
              className="w-full bg-black text-white h-[52px] text-[14px] uppercase rounded-md cursor-pointer"
              onClick={handleSubmit}
              disabled={loading}
            >
              {t("leaveFeedback")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
