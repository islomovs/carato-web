"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReviewsBlock from "@/components/shared/product/ReviewsBlock";
import MyOrdersBlock from "@/components/shared/profile/my-orders/MyOrdersBlock";
import PersonalInfoBlock from "@/components/shared/profile/PersonalInfoBlock";

const tabs = [
  { id: "personal", label: "Личные данные" },
  { id: "orders", label: "Мои заказы" },
  { id: "reviews", label: "Отзывы" },
];

export default function Profile() {
  const t = useTranslations("profile");

  const [active, setActive] = useState("personal");

  return (
    <>
      <div className="flex flex-col justify-center items-center md:space-y-[52px] md:my-[52px] mt-16 md:mt-0">
        <h1 className="font-normal text-2xl my-8 md:my-[52px] md:text-[28px]">
          {t("title")}
        </h1>

        {/* -------- TABS -------- */}
        <div className="sticky top-16 md:top-16 bg-white z-30 border-y border-y-[#EEF2F6] w-full">
          <div className="flex justify-between px-4 md:px-0 md:justify-center md:gap-[40px] relative">
            {tabs.map((tab) => {
              const isActive = tab.id === active;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "relative py-[24px] min-w-[99px] text-[14px] font-normal text-[#1D1D1F] transition-colors cursor-pointer",
                    isActive ? "font-medium" : "text-[#697586]"
                  )}
                >
                  {tab.label}

                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="absolute left-0 right-0 -bottom-[1px] h-[0.5px] bg-black"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* -------- TAB CONTENT -------- */}
        <div className="w-full flex justify-center px-4 py-6 md:px-0 md:py-0 mb-[52px]">
          <AnimatePresence mode="wait">
            {active === "personal" && <PersonalInfoBlock />}

            {active === "orders" && <MyOrdersBlock />}

            {active === "reviews" && <ReviewsBlock />}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
