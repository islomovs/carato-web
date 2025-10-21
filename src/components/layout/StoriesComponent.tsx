/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { PanInfo } from "framer-motion";

const stories = [
  { title: "New Collection", image: "/images/news-placeholder.png" },
  { title: "Summer Sale", image: "/images/category-placeholder.png" },
  { title: "Limited Edition", image: "/images/promo1.jpg" },
  { title: "Accessories", image: "/images/news-placeholder.png" },
  { title: "Watches", image: "/images/news-placeholder.png" },
];

export default function StoriesSection() {
  const t = useTranslations("");
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = 4000;

  // autoplay progress
  useEffect(() => {
    if (activeStory === null) return;

    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeStory < stories.length - 1) {
            setActiveStory(activeStory + 1);
          } else {
            setActiveStory(null);
          }
          return 0;
        }
        return prev + 1;
      });
    }, duration / 100);

    return () => clearInterval(timerRef.current!);
  }, [activeStory]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 80 || velocity > 500) {
      // Swipe right → previous story
      setActiveStory((prev) => (prev && prev > 0 ? prev - 1 : prev));
    } else if (offset < -80 || velocity < -500) {
      // Swipe left → next story
      setActiveStory((prev) =>
        prev !== null && prev < stories.length - 1 ? prev + 1 : prev
      );
    }
  };

  return (
    <section className="w-full flex overflow-x-auto no-scrollbar py-8 px-4 md:px-0">
      {stories.map((story, i) => (
        <motion.div
          key={story.title}
          onClick={() => setActiveStory(i)}
          className="relative min-w-[144px] h-[200px] cursor-pointer group overflow-hidden shrink-0"
          whileHover={{ scale: 1.02 }}
        >
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <motion.div className="absolute bottom-0 left-0 right-0 h-[52px] bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-[12px] font-[400]">
              {story.title}
            </span>
          </motion.div>
        </motion.div>
      ))}

      <AnimatePresence>
        {activeStory !== null && (
          <>
            {/* background overlay — closes on click */}
            <motion.div
              className="fixed inset-0 bg-[#00000066] z-40 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveStory(null)}
            />

            {/* top controls */}
            <div className="fixed top-[32px] right-[32px] z-[100] flex gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-9 h-9 flex items-center justify-center bg-white rounded-md cursor-pointer"
              >
                <Image
                  src={
                    isMuted ? "/icons/volume-x.svg" : "/icons/volume-max.svg"
                  }
                  alt="volume"
                  width={20}
                  height={20}
                />
              </button>
              <button
                onClick={() => setActiveStory(null)}
                className="w-9 h-9 flex items-center justify-center bg-white rounded-md cursor-pointer"
              >
                <Image
                  src="/icons/x-close.svg"
                  alt="close"
                  width={20}
                  height={20}
                />
              </button>
            </div>

            {/* story modal */}
            <motion.div
              key="modal"
              className="fixed z-50 inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Left preview */}
              {activeStory > 0 && (
                <motion.div
                  onClick={() => setActiveStory(activeStory - 1)}
                  className="absolute left-[10%] z-40 w-[300px] h-[70vh] overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                >
                  <Image
                    src={stories[activeStory - 1].image}
                    alt="prev"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[#00000080]" />
                </motion.div>
              )}

              {/* Right preview */}
              {activeStory < stories.length - 1 && (
                <motion.div
                  onClick={() => setActiveStory(activeStory + 1)}
                  className="absolute right-[10%] z-40 w-[300px] h-[70vh] overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                >
                  <Image
                    src={stories[activeStory + 1].image}
                    alt="next"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[#00000080]" />
                </motion.div>
              )}

              {/* Main story */}
              <motion.div
                className="relative w-[90%] max-w-[409px] h-[90vh] bg-black overflow-hidden flex flex-col items-center justify-center"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
              >
                {/* progress bars */}
                <div className="absolute top-3 left-3 right-3 flex gap-1 z-50">
                  {stories.map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 h-[4px] rounded-full bg-[#9AA4B2] overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width:
                            index === activeStory
                              ? `${progress}%`
                              : index < activeStory
                                ? "100%"
                                : "0%",
                        }}
                        transition={{ ease: "linear", duration: 0.3 }}
                        className="h-full bg-white"
                      />
                    </div>
                  ))}
                </div>

                {/* Story image with smooth animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stories[activeStory].image}
                    initial={{ opacity: 0, x: 80, scale: 1.05 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -80, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={stories[activeStory].image}
                      alt={stories[activeStory].title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* navigation arrows */}
                <div className="absolute inset-0 flex justify-between items-center px-3 z-50">
                  <button
                    className="w-9 h-9 bg-white rounded-md flex items-center justify-center cursor-pointer"
                    onClick={() =>
                      setActiveStory((prev) =>
                        prev && prev > 0 ? prev - 1 : prev
                      )
                    }
                  >
                    <Image
                      src="/icons/chevron-left.svg"
                      alt="previous"
                      width={20}
                      height={20}
                    />
                  </button>
                  <button
                    className="w-9 h-9 bg-white rounded-md flex items-center justify-center cursor-pointer"
                    onClick={() =>
                      setActiveStory((prev) =>
                        prev !== null && prev < stories.length - 1
                          ? prev + 1
                          : prev
                      )
                    }
                  >
                    <Image
                      src="/icons/chevron-right.svg"
                      alt="next"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>

                {/* bottom button */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6">
                  <Button
                    variant="outline"
                    className="w-full h-[36px] md:h-[52px] text-sm uppercase font-normal rounded-md bg-white text-black border border-black hover:bg-black hover:!text-white transition-colors duration-200 cursor-pointer"
                  >
                    See All
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
