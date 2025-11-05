"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export type MediaItemT =
  | { id: string | number; type: "image"; src: string; alt?: string }
  | {
      id: string | number;
      type: "video";
      src: string;
      poster?: string;
      alt?: string;
    };

export default function MediaItem({
  media,
  onClick,
  fullHeight = false,
  videoRef,
  onTogglePlay,
}: {
  media: MediaItemT;
  onClick?: () => void;
  fullHeight?: boolean;
  videoRef?: React.MutableRefObject<HTMLVideoElement | null>;
  onTogglePlay?: () => void;
}) {
  const isVideo = media.type === "video";
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTogglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const video = videoRef?.current;
      if (!video) return;

      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }

      onTogglePlay?.();
    },
    [videoRef, onTogglePlay]
  );

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef?.current;
    if (!video || !video.duration) return;
    setProgress(video.currentTime / video.duration);
  }, [videoRef]);

  // 🆕 When video ends → reset play state and progress
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
  }, []);

  return (
    <div
      className={`relative w-full h-full bg-gray-100 overflow-hidden flex items-center justify-center ${
        fullHeight ? "h-full" : ""
      }`}
      onClick={onClick}
    >
      {isVideo ? (
        <>
          <video
            ref={videoRef}
            src={media.src}
            poster={media.poster}
            className="object-cover w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            playsInline
            preload="metadata"
          />

          <div className="absolute left-4 right-4 bottom-4 flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="w-[36px] h-[36px] hover:bg-transparent border-none p-0 cursor-pointer"
              onClick={handleTogglePlay}
            >
              <Image
                src={isPlaying ? "/icons/pause-square.svg" : "/icons/play.svg"}
                width={20}
                height={20}
                alt={isPlaying ? "pause" : "play"}
                className="filter invert"
              />
            </Button>

            <div className="relative flex-1 h-[4px] rounded-full bg-[#9AA4B2] overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-white rounded-full"
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
        </>
      ) : (
        <Image
          src={media.src}
          alt={media.alt || ""}
          fill
          className="object-cover"
        />
      )}
    </div>
  );
}
