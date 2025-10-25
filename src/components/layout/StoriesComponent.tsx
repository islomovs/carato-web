/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import StoryNavigation from "@/components/shared/stories/StoryNavigation";
import StoryProgressBars from "../shared/stories/StoryProgressBars";
import StoryPreviews from "../shared/stories/StoryPreviews";
import StoryList from "../shared/stories/StoryList";
import StoryControls from "../shared/stories/StoryControls";

interface StoryImage {
  startTime: string;
  endTime: string;
  textUz: string;
  textRu: string;
  textEn: string;
  image: string;
  sortOrder: number;
  redirectTo?: string;
}

interface Story {
  title: string;
  startTime: string;
  endTime: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  images: StoryImage[];
}

// TEMP MOCK DATA (expanded for testing)
const stories: Story[] = [
  {
    title: "New Collection",
    startTime: "2025-10-25T15:38:31.562Z",
    endTime: "2025-10-25T15:38:31.562Z",
    image: "/images/news-placeholder.png",
    sortOrder: 0,
    isActive: true,
    images: [
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Yangi kolleksiya 1",
        textRu: "Новая коллекция 1",
        textEn: "New Collection 1",
        image: "/images/news-placeholder.png",
        sortOrder: 0,
        redirectTo: "#",
      },
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Yangi kolleksiya 2",
        textRu: "Новая коллекция 2",
        textEn: "New Collection 2",
        image: "/images/collection-placeholder.webp",
        sortOrder: 1,
        redirectTo: "#",
      },
    ],
  },
  {
    title: "Summer Sale",
    startTime: "2025-10-25T15:38:31.562Z",
    endTime: "2025-10-25T15:38:31.562Z",
    image: "/images/promo1.jpg",
    sortOrder: 1,
    isActive: true,
    images: [
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Yozgi chegirmalar boshlandi!",
        textRu: "Началась летняя распродажа!",
        textEn: "Summer sale is here!",
        image: "/images/promo1.jpg",
        sortOrder: 0,
        redirectTo: "#",
      },
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Eng yaxshi narxlar faqat bugun!",
        textRu: "Лучшие цены только сегодня!",
        textEn: "Best prices only today!",
        image: "/images/promo3.jpg",
        sortOrder: 1,
        redirectTo: "#",
      },
    ],
  },
  {
    title: "Golden Harmony",
    startTime: "2025-10-25T15:38:31.562Z",
    endTime: "2025-10-25T15:38:31.562Z",
    image: "/images/news-golden-harmony.jpg",
    sortOrder: 2,
    isActive: true,
    images: [
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Oltin uyg‘unlik kolleksiyasi",
        textRu: "Коллекция Золотая гармония",
        textEn: "Golden Harmony Collection",
        image: "/images/news-golden-harmony.jpg",
        sortOrder: 0,
        redirectTo: "#",
      },
    ],
  },
  {
    title: "Crafted Eternity",
    startTime: "2025-10-25T15:38:31.562Z",
    endTime: "2025-10-25T15:38:31.562Z",
    image: "/images/news-crafted-eternity.jpg",
    sortOrder: 3,
    isActive: true,
    images: [
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Abadiyat bilan yaratilgan",
        textRu: "Создано с вечностью",
        textEn: "Crafted with Eternity",
        image: "/images/news-crafted-eternity.jpg",
        sortOrder: 0,
        redirectTo: "#",
      },
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Zargarlikda mukammallik",
        textRu: "Совершенство в ювелирном искусстве",
        textEn: "Perfection in jewellery art",
        image: "/images/jewellery-rings.jpg",
        sortOrder: 1,
        redirectTo: "#",
      },
    ],
  },
  {
    title: "Grand Opening",
    startTime: "2025-10-25T15:38:31.562Z",
    endTime: "2025-10-25T15:38:31.562Z",
    image: "/images/news-opening.jpg",
    sortOrder: 4,
    isActive: true,
    images: [
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Yangi do‘konimiz ochildi!",
        textRu: "Открылся наш новый магазин!",
        textEn: "Our new store is open!",
        image: "/images/news-opening.jpg",
        sortOrder: 0,
        redirectTo: "#",
      },
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Kelib, yangi kolleksiyani ko‘ring",
        textRu: "Приходите и посмотрите новую коллекцию",
        textEn: "Come and see the new collection",
        image: "/images/banner-placeholder.jpg",
        sortOrder: 1,
        redirectTo: "#",
      },
    ],
  },
  {
    title: "Bestsellers",
    startTime: "2025-10-25T15:38:31.562Z",
    endTime: "2025-10-25T15:38:31.562Z",
    image: "/images/category-placeholder.png",
    sortOrder: 5,
    isActive: true,
    images: [
      {
        startTime: "2025-10-25T15:38:31.562Z",
        endTime: "2025-10-25T15:38:31.562Z",
        textUz: "Eng ko‘p sotilgan mahsulotlar",
        textRu: "Самые продаваемые товары",
        textEn: "Top selling products",
        image: "/images/product-placeholder.png",
        sortOrder: 0,
        redirectTo: "#",
      },
    ],
  },
];

export default function StoriesSection() {
  const t = useTranslations("home");
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duration = 4000;

  useEffect(() => {
    if (activeStoryIndex === null) return;

    const story = stories[activeStoryIndex];
    if (!story || !story.images.length) return;

    let progressValue = 0;
    const step = 100 / (duration / 50); // smoother frame steps (every 50ms)

    // clear old timer
    if (timerRef.current) clearInterval(timerRef.current);

    // start new timer
    timerRef.current = setInterval(() => {
      progressValue += step;

      if (progressValue >= 100) {
        const isLastImage = activeImageIndex >= story.images.length - 1;
        const isLastStory = activeStoryIndex >= stories.length - 1;

        if (!isLastImage) {
          // next image in same story group
          setActiveImageIndex((prev) => prev + 1);
        } else if (!isLastStory) {
          // move to next story group
          setActiveStoryIndex((prev) => (prev ?? 0) + 1);
          setActiveImageIndex(0);
        } else {
          // finished all stories
          setActiveStoryIndex(null);
          setActiveImageIndex(0);
        }

        progressValue = 0; // reset internal progress
      }

      setProgress(progressValue);
    }, 50);

    // 🖼 preload next image (to remove black flicker)
    const nextImgSrc =
      story.images[activeImageIndex + 1]?.image ??
      stories[activeStoryIndex + 1]?.images?.[0]?.image;
    if (nextImgSrc) {
      const img = new globalThis.Image();
      img.src = nextImgSrc;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // ✅ key detail: depend on both activeStoryIndex and activeImageIndex
  }, [activeStoryIndex, activeImageIndex]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const story = stories[activeStoryIndex ?? 0];

    if (!story) return;

    if (offset > 80 || velocity > 500) {
      if (activeImageIndex > 0) {
        setActiveImageIndex((p) => p - 1);
      } else if (activeStoryIndex && activeStoryIndex > 0) {
        setActiveStoryIndex((p) => p! - 1);
        const prevStory = stories[activeStoryIndex - 1];
        setActiveImageIndex(prevStory?.images?.length - 1 || 0);
      }
    } else if (offset < -80 || velocity < -500) {
      if (activeImageIndex < story.images.length - 1) {
        setActiveImageIndex((p) => p + 1);
      } else if (activeStoryIndex! < stories.length - 1) {
        setActiveStoryIndex((p) => p! + 1);
        setActiveImageIndex(0);
      }
    }
  };

  const currentStory =
    activeStoryIndex !== null ? stories[activeStoryIndex] : null;
  const currentImage = currentStory?.images?.[activeImageIndex] ?? null;

  return (
    <section className="w-full flex overflow-x-auto md:overflow-x-visible no-scrollbar mt-4 md:mt-10 touch-pan-x select-none">
      <StoryList
        stories={stories}
        onSelect={(index) => {
          setActiveStoryIndex(index);
          setActiveImageIndex(0);
        }}
      />

      <AnimatePresence>
        {currentStory && (
          <motion.div
            key="story-overlay"
            className="fixed inset-0 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="absolute inset-0 bg-black/80 cursor-pointer backdrop-blur-sm z-[40]"
              onClick={() => setActiveStoryIndex(null)}
            />

            <StoryControls
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              onClose={() => setActiveStoryIndex(null)}
            />

            {activeStoryIndex !== null && (
              <StoryPreviews
                stories={stories}
                activeStoryIndex={activeStoryIndex}
              />
            )}

            {/* Main Story Modal */}
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
              >
                <StoryProgressBars
                  progress={progress}
                  currentStory={currentStory}
                  activeImageIndex={activeImageIndex}
                />

                {/* Story image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={
                      currentImage?.image ||
                      `story-${activeStoryIndex}-img-${activeImageIndex}`
                    }
                    initial={{ opacity: 0, x: 80, scale: 1.05 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -80, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <NextImage
                      src={
                        currentImage?.image || "/images/banner-placeholder.jpg"
                      }
                      alt={currentStory?.title ?? "story"}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Bottom button */}
                <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center px-6 gap-2 z-[90]">
                  <Button
                    variant="outline"
                    className="w-full h-[52px] text-sm uppercase font-normal rounded-md bg-white text-black border border-black hover:bg-black hover:text-white transition-colors duration-200"
                  >
                    {t("learnMore")}
                  </Button>
                </div>

                <StoryNavigation
                  stories={stories}
                  activeStoryIndex={activeStoryIndex!}
                  activeImageIndex={activeImageIndex}
                  setActiveStoryIndex={setActiveStoryIndex}
                  setActiveImageIndex={setActiveImageIndex}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
