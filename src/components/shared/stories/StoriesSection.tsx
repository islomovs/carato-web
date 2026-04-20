/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import StoryNavigation from "@/components/shared/stories/StoryNavigation";
import StoryProgressBars from "./StoryProgressBars";
import StoryPreviews from "./StoryPreviews";
import StoryList from "./StoryList";
import StoryControls from "./StoryControls";
import { isVideoUrl, StoryMediaItem, getStoryById } from "@/services/stories";
import { useStories } from "@/hooks/useStories";

export default function StoriesSection() {
  const t = useTranslations("home");
  const locale = useLocale();

  // ─── story list (from /stories/all) ────────────────────────────────────────
  const { stories, loading } = useStories(locale);

  // ─── which story / slide is open ───────────────────────────────────────────
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // media items for the currently open story (from /stories/{id})
  const [activeMedia, setActiveMedia] = useState<StoryMediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  // ─── playback state ────────────────────────────────────────────────────────
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isPausedRef = useRef(false);

  const duration = 4000;

  // ─── open a story: fetch its media ─────────────────────────────────────────
  const openStory = useCallback(
    async (index: number) => {
      const story = stories[index];
      if (!story) return;

      setActiveStoryIndex(index);
      setActiveImageIndex(0);
      setActiveMedia([]);
      setMediaLoading(true);

      try {
        const details = await getStoryById(story.id, locale);
        const media = details?.media ?? [];
        setActiveMedia(media);
      } catch {
        setActiveMedia([]);
      } finally {
        setMediaLoading(false);
      }
    },
    [stories, locale],
  );

  // ─── pause helper (ref-based to avoid stale closures in setInterval) ───────
  const setPaused = (paused: boolean) => {
    isPausedRef.current = paused;
    const vid = videoRef.current;
    if (!vid) return;
    if (paused) vid.pause();
    else vid.play().catch(() => {});
  };

  // ─── advance to next slide / story ─────────────────────────────────────────
  const goNext = useCallback(() => {
    if (activeStoryIndex === null) return;
    const isLastImage = activeImageIndex >= activeMedia.length - 1;
    const isLastStory = activeStoryIndex >= stories.length - 1;

    if (!isLastImage) {
      setActiveImageIndex((p) => p + 1);
    } else if (!isLastStory) {
      openStory(activeStoryIndex + 1);
    } else {
      setActiveStoryIndex(null);
      setActiveImageIndex(0);
      setActiveMedia([]);
    }
  }, [
    activeStoryIndex,
    activeImageIndex,
    activeMedia.length,
    stories.length,
    openStory,
  ]);

  // ─── interval timer for image slides ───────────────────────────────────────
  useEffect(() => {
    if (activeStoryIndex === null || mediaLoading) return;
    if (!activeMedia.length) return;

    const currentMedia = activeMedia[activeImageIndex];
    const isVideo = isVideoUrl(currentMedia?.image ?? "");

    progressRef.current = 0;
    setProgress(0);

    if (timerRef.current) clearInterval(timerRef.current);

    if (!isVideo) {
      const step = 100 / (duration / 50);

      timerRef.current = setInterval(() => {
        if (isPausedRef.current) return;

        progressRef.current += step;

        if (progressRef.current >= 100) {
          progressRef.current = 0;
          goNext();
          return;
        }

        setProgress(progressRef.current);
      }, 50);
    }

    // Preload next image
    const nextSrc = activeMedia[activeImageIndex + 1]?.image;
    if (nextSrc && !isVideoUrl(nextSrc)) {
      const img = new globalThis.Image();
      img.src = nextSrc;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStoryIndex, activeImageIndex, activeMedia, mediaLoading]);

  // ─── sync mute to video element ────────────────────────────────────────────
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  // ─── video callbacks ───────────────────────────────────────────────────────
  const handleVideoTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    setProgress((vid.currentTime / vid.duration) * 100);
  };

  // ─── swipe ─────────────────────────────────────────────────────────────────
  const handleDragEnd = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;

    if (offset.x > 80 || velocity.x > 500) {
      // swipe right → previous
      if (activeImageIndex > 0) {
        setActiveImageIndex((p) => p - 1);
      } else if (activeStoryIndex && activeStoryIndex > 0) {
        openStory(activeStoryIndex - 1);
      }
    } else if (offset.x < -80 || velocity.x < -500) {
      // swipe left → next
      if (activeImageIndex < activeMedia.length - 1) {
        setActiveImageIndex((p) => p + 1);
      } else if (
        activeStoryIndex !== null &&
        activeStoryIndex < stories.length - 1
      ) {
        openStory(activeStoryIndex + 1);
      }
    }
  };

  // ─── derived ───────────────────────────────────────────────────────────────
  const currentStory =
    activeStoryIndex !== null ? stories[activeStoryIndex] : null;
  const currentMedia = activeMedia[activeImageIndex] ?? null;
  const currentIsVideo = isVideoUrl(currentMedia?.image ?? "");

  // Build a shape StoryProgressBars / StoryNavigation expect
  // (they were written against the old mock shape with .images[])
  const progressStory = currentStory
    ? { ...currentStory, images: activeMedia }
    : null;

  return (
    <section className="w-full flex overflow-x-auto md:overflow-x-visible no-scrollbar mt-4 md:mt-10 touch-pan-x select-none">
      {loading ? (
        // Skeleton row while fetching story list
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[144px] h-[200px] bg-gray-200 animate-pulse shrink-0"
            />
          ))}
        </div>
      ) : (
        <StoryList
          stories={stories}
          onSelect={(index: number) => openStory(index)}
        />
      )}

      <AnimatePresence>
        {currentStory && (
          <motion.div
            key="story-overlay"
            className="fixed inset-0 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/80 cursor-pointer backdrop-blur-sm z-[40]"
              onClick={() => {
                setActiveStoryIndex(null);
                setActiveMedia([]);
              }}
            />

            <StoryControls
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((m) => !m)}
              onClose={() => {
                setActiveStoryIndex(null);
                setActiveMedia([]);
              }}
              showMute={currentIsVideo}
            />

            {activeStoryIndex !== null && (
              <StoryPreviews
                stories={stories}
                activeStoryIndex={activeStoryIndex}
              />
            )}

            <motion.div
              className="absolute inset-0 flex items-center justify-center z-[80]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative w-full h-full bg-black md:w-[90%] md:h-[90vh] md:max-w-[409px] overflow-hidden flex flex-col items-center justify-center"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                onPointerDown={() => setPaused(true)}
                onPointerUp={() => setPaused(false)}
                onPointerLeave={() => setPaused(false)}
              >
                {/* Progress bars */}
                {progressStory && (
                  <StoryProgressBars
                    progress={progress}
                    currentStory={progressStory as any}
                    activeImageIndex={activeImageIndex}
                  />
                )}

                {/* Media */}
                <AnimatePresence mode="wait">
                  {mediaLoading ? (
                    <motion.div
                      key="loader"
                      className="absolute inset-0 bg-black flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`${activeStoryIndex}-${activeImageIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0"
                    >
                      {currentIsVideo ? (
                        <video
                          ref={videoRef}
                          src={currentMedia?.image ?? ""}
                          autoPlay
                          playsInline
                          muted={isMuted}
                          className="w-full h-full object-cover"
                          onTimeUpdate={handleVideoTimeUpdate}
                          onEnded={goNext}
                        />
                      ) : (
                        <NextImage
                          src={
                            currentMedia?.image ||
                            "/images/banner-placeholder.jpg"
                          }
                          alt={currentStory?.title ?? "story"}
                          fill
                          className="object-cover"
                          priority
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA */}
                {currentMedia?.redirectTo && (
                  <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center px-6 gap-2 z-[96]">
                    <Button
                      variant="outline"
                      className="w-full h-[52px] text-sm uppercase font-normal rounded-md bg-white text-black border border-black hover:bg-black hover:text-white transition-colors duration-200"
                      onClick={() => {
                        if (currentMedia.redirectTo) {
                          window.location.href = currentMedia.redirectTo;
                        }
                      }}
                    >
                      {t("learnMore")}
                    </Button>
                  </div>
                )}

                {progressStory && (
                  <StoryNavigation
                    stories={stories as any}
                    activeStoryIndex={activeStoryIndex!}
                    activeImageIndex={activeImageIndex}
                    setActiveStoryIndex={(idx) => {
                      if (idx === null) {
                        setActiveStoryIndex(null);
                        setActiveMedia([]);
                      } else {
                        openStory(idx as number);
                      }
                    }}
                    setActiveImageIndex={setActiveImageIndex}
                  />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
