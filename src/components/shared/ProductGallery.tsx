/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(
    variant === "fullscreen"
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Stop video playback when moving away or variant change
    if (media[index].type !== "video") {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [index, media]);

  // Toggle play/pause for video (used by overlay)
  const togglePlay = async () => {
    if (media[index].type !== "video" || !videoRef.current) return;
    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Autoplay policies may block; still toggle state
      setIsPlaying((s) => !s);
    }
  };

  // Layout widths:
  // On lg and up, the page gallery should respect Figma widths approximation:
  // gallery: 794px, info: 520px -> use flex with basis and max-width
  // We'll set container to flex; gallery gets max-w-[794px], info gets max-w-[520px].
  // On smaller screens, stack vertically and gallery becomes full width.

  // Render variants
  if (variant === "page") {
    return (
      <>
        {/* Gallery left */}
        <div className="w-full lg:max-w-[794px]">
          {/* Grid layout updated: 2 items in first row, 3 in second */}
          <div className="grid gap-[20px]">
            {/* Row 1 — two large images */}
            <div className="grid grid-cols-2 gap-[20px]">
              {media.slice(0, 2).map((m, i) => (
                <div key={m.id} className="relative" style={{ height: 526 }}>
                  <MediaItem
                    media={m}
                    onClick={() => {
                      setIndex(i);
                      setIsFullscreenOpen(true);
                    }}
                    videoRef={media[i].type === "video" ? videoRef : undefined}
                    onTogglePlay={togglePlay}
                  />
                </div>
              ))}
            </div>

            {/* Row 2 — three smaller images */}
            <div className="grid grid-cols-3 gap-[20px]">
              {media.slice(2, 5).map((m, i) => (
                <div key={m.id} className="relative" style={{ height: 264 }}>
                  <MediaItem
                    media={m}
                    onClick={() => {
                      setIndex(2 + i);
                      setIsFullscreenOpen(true);
                    }}
                    videoRef={
                      media[2 + i].type === "video" ? videoRef : undefined
                    }
                    onTogglePlay={togglePlay}
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
      <div className="w-full aspect-[4/5] h-full overflow-hidden">
        <ModalMediaSwiper media={media} startIndex={index} />
      </div>
    );
  }

  // fullscreen handled via separate component below if required
  return null;
}
