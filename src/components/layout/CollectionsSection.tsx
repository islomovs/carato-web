"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { NavButton } from "../ui/nav-button";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function CollectionsSection() {
  const t = useTranslations("home");
  const [activeIndex, setActiveIndex] = useState(0);

  const collections = [
    { title: "Rings", image: "/images/category-placeholder.png" },
    { title: "Earrings", image: "/images/category-placeholder.png" },
    { title: "Necklaces", image: "/images/category-placeholder.png" },
    { title: "Bracelets", image: "/images/category-placeholder.png" },
    { title: "Watches", image: "/images/category-placeholder.png" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % collections.length);
    }, 4000); // every 4 seconds
    return () => clearInterval(interval);
  }, [collections.length]);

  return (
    <section className="w-full h-[700px] flex overflow-hidden">
      {collections.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <motion.div
            key={item.title}
            onClick={() => setActiveIndex(index)}
            className="relative cursor-pointer overflow-hidden flex items-end justify-center"
            animate={{
              flex: isActive ? 992 : 112,
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
            }}
            style={{
              height: "700px",
            }}
          >
            {/* Image */}
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700"
            />

            {/* Overlay for inactive */}
            {!isActive && (
              <motion.div
                className="absolute inset-0 bg-[#00000099]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}

            <AnimatePresence mode="wait">
              {isActive ? (
                <motion.div
                  key="active"
                  className="absolute left-[32px] bottom-[32px] flex flex-col items-start gap-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-[28px] font-[400] text-black">
                    {item.title}
                  </h2>
                  <NavButton
                    active
                    className="w-fit uppercase text-black hover:text-black"
                    underlineColor="black"
                  >
                    {t("seeAll")}
                  </NavButton>
                </motion.div>
              ) : (
                <motion.div
                  key="inactive"
                  className="absolute bottom-[80px] left-1/2 -translate-x-1/2 rotate-[-90deg] origin-center flex items-start justify-start w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-[28px] font-[400] text-white text-center whitespace-nowrap">
                    {item.title}
                  </h2>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </section>
  );
}
