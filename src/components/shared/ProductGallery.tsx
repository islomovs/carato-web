"use client";

import React, { useState } from "react";
import MediaItem, { MediaItemT } from "./MediaItem";
import FullscreenViewer from "./FullscreenViewer";
import ModalMediaSwiper from "./ModalMediaSwiper";

type Props = {
  media: MediaItemT[];
  variant?: "page" | "modal" | "fullscreen";
  initialIndex?: number;
};

export default function ProductGallery({
  media,
  variant = "page",
  initialIndex = 0,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(
    variant === "fullscreen"
  );

  // Render variants
  if (variant === "page") {
    return (
      <>
        {/* Gallery left */}
        <div className="w-full">
          {/* Grid layout updated: 2 items in first row, 3 in second */}
          <div className="grid gap-[20px]">
            {/* Row 1 — two large images */}
            <div className="grid grid-cols-2 gap-[20px]">
              {media.slice(0, 2).map((m, i) => (
                <div
                  key={m.id}
                  className="relative cursor-pointer"
                  style={{ height: 526 }}
                >
                  <MediaItem
                    media={m}
                    onClick={() => {
                      setIndex(i);
                      setIsFullscreenOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Row 2 — three smaller images */}
            <div className="grid grid-cols-3 gap-[20px]">
              {media.slice(2, 5).map((m, i) => (
                <div
                  key={m.id}
                  className="relative cursor-pointer"
                  style={{ height: 264 }}
                >
                  <MediaItem
                    media={m}
                    onClick={() => {
                      setIndex(2 + i);
                      setIsFullscreenOpen(true);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Fullscreen overlay launcher */}
          {isFullscreenOpen && (
            <FullscreenViewer
              media={media}
              startIndex={index}
              onClose={() => setIsFullscreenOpen(false)}
            />
          )}
        </div>
      </>
    );
  }

  if (variant === "modal") {
    return (
      <div className="w-full h-full aspect-[4/5] overflow-hidden rounded-none">
        <ModalMediaSwiper
          media={media}
          startIndex={index}
          onClick={() => {
            setIndex(index + 1 >= media.length ? 0 : index + 1);
            setIsFullscreenOpen(true);
          }}
        />
        {isFullscreenOpen && (
          <FullscreenViewer
            media={media}
            startIndex={index}
            onClose={() => setIsFullscreenOpen(false)}
          />
        )}
      </div>
    );
  }

  // fullscreen handled via separate component below if required
  return null;
}
