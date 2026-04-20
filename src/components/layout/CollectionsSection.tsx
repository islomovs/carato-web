"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { NavButton } from "../ui/nav-button";
import { useTranslations, useLocale } from "next-intl";
import { useCollections } from "@/hooks/useCollection";
import { useRouter } from "next/navigation";

export default function CollectionsSection() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const { collections, loading, error } = useCollections(locale);

  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % collections.length);
    }, 4000);
  };

  useEffect(() => {
    if (collections.length > 0) resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, collections]);

  if (loading)
    return (
      <div className="h-[700px] flex items-center justify-center">
        Загрузка...
      </div>
    );
  if (error)
    return (
      <div className="h-[700px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  if (!collections.length) return null;

  const handleClick = (index: number) => {
    setActiveIndex(index);
    resetTimer();
  };

  return (
    <>
      {/* Desktop */}
      <section className="hidden md:flex w-full h-[700px] overflow-hidden">
        {collections.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <motion.div
              key={item.id}
              onClick={() => handleClick(index)}
              className="relative cursor-pointer overflow-hidden flex items-end justify-center"
              animate={{
                flex: isActive ? 992 : 112,
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
              }}
              style={{ height: "700px" }}
            >
              <Image
                src={item.desktopImage || "/images/collection-placeholder.webp"}
                alt={item.title}
                fill
                className="object-cover"
              />

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
                      onClick={() => router.push(`/${locale}/collections/${item.slug}`)}
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

      {/* Mobile */}
      <section className="flex md:hidden w-full h-[700px] flex-col overflow-hidden">
        {collections.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <motion.div
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className="relative cursor-pointer overflow-hidden flex justify-end"
              animate={{
                flex: isActive ? 8 : 1,
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
              }}
              style={{ width: "100%" }}
            >
              <Image
                src={item.mobileImage || "/images/collection-placeholder.webp"}
                alt={item.title}
                fill
                className="object-cover"
              />

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
                    key="active-mobile"
                    className="absolute bottom-[24px] left-[24px] flex flex-col items-start gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-[22px] font-[400] text-black">
                      {item.title}
                    </h2>
                    <NavButton
                      active
                      className="w-fit uppercase text-black hover:text-black"
                      underlineColor="black"
                      onClick={() => router.push(`/${locale}/collections/${item.slug}`)}
                    >
                      {t("seeAll")}
                    </NavButton>
                  </motion.div>
                ) : (
                  <motion.div
                    key="inactive-mobile"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-[22px] font-[400] text-white text-center whitespace-nowrap">
                      {item.title}
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </section>
    </>
  );
}
