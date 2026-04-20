"use client";

import React, { useState } from "react";
import MediaItem, { MediaItemT } from "./MediaItem";
import FullscreenViewer from "./FullscreenViewer";
import ModalMediaSwiper from "./ModalMediaSwiper";
import { Skeleton } from "@/components/ui/skeleton";
import useLockScroll from "@/hooks/useLockScroll";

type Props = {
  media: MediaItemT[];
  variant?: "page" | "modal" | "fullscreen";
  initialIndex?: number;
  loading?: boolean;
};

export default function ProductGallery({
  media,
  variant = "page",
  initialIndex = 0,
  loading = false,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(
    variant === "fullscreen"
  );

  useLockScroll(isFullscreenOpen);

  // Render variants
  if (variant === "page") {
    return loading ? (
      <div className="grid gap-[20px]">
        <div className="grid grid-cols-2 gap-[20px]">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[526px] w-full rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-[20px]">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[264px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    ) : (
      <>
        {/* Gallery left */}
        <div className="w-full">
          <div className="grid gap-[20px]">
            {/* Row 1 — single image takes full width; 2+ images use 2-col grid */}
            <div
              className={
                media.length === 1
                  ? "grid grid-cols-1"
                  : "grid grid-cols-2 gap-[20px]"
              }
            >
              {media.slice(0, 2).map((m, i) => (
                <div
                  key={m.id}
                  className="relative cursor-pointer"
                  style={{ height: 526 }}
                >
                  <MediaItem
                    media={m}
                    loading={loading}
                    onClick={() => {
                      setIndex(i);
                      setIsFullscreenOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Row 2 — three smaller images (only rendered if there are 3+ images) */}
            {media.length > 2 && (
              <div className="grid grid-cols-3 gap-[20px]">
                {media.slice(2, 5).map((m, i) => (
                  <div
                    key={m.id}
                    className="relative cursor-pointer"
                    style={{ height: 264 }}
                  >
                    <MediaItem
                      media={m}
                      loading={loading}
                      onClick={() => {
                        setIndex(2 + i);
                        setIsFullscreenOpen(true);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen overlay launcher */}
          {isFullscreenOpen && (
            <FullscreenViewer
              media={media}
              startIndex={index}
              onClose={() => setIsFullscreenOpen(false)}
              loading={loading}
            />
          )}
        </div>
      </>
    );
  }

  if (variant === "modal") {
    return loading ? (
      <div className="w-full h-full flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[500px] w-full rounded-lg" />
        ))}
      </div>
    ) : (
      <div className="w-full h-full aspect-[4/5] overflow-hidden rounded-none">
        <ModalMediaSwiper
          media={media}
          startIndex={index}
          onClick={() => {
            setIndex(index + 1 >= media.length ? 0 : index + 1);
            setIsFullscreenOpen(true);
          }}
          loading={loading}
        />
        {isFullscreenOpen && (
          <FullscreenViewer
            media={media}
            startIndex={index}
            onClose={() => setIsFullscreenOpen(false)}
            loading={loading}
          />
        )}
      </div>
    );
  }

  // fullscreen handled via separate component below if required
  return null;
}
