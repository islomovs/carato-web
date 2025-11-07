"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MediaItemT } from "./MediaItem";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  media: MediaItemT[];
  initialIndex?: number;
}

export default function VideoPlayer({
  src,
  poster,
  className = "",
  media,
  initialIndex = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [index, setIndex] = useState(initialIndex);

  const togglePlay = async () => {
    if (media[index].type !== "video" || !videoRef.current) return;
    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Autoplay policies may block; still toggle state
    }
  };

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

      togglePlay();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videoRef]
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
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="object-cover w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        playsInline
        preload="metadata"
      />

      {/* Controls */}
      <div className="absolute left-4 right-4 bottom-4 flex items-center gap-4">
        {/* Play/Pause button */}
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

        {/* Progress bar */}
        <div className="relative flex-1 h-[4px] rounded-full bg-[#9AA4B2] overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-white rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
