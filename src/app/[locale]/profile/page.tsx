"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import ReviewsBlock from "@/components/shared/ReviewsBlock";
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
      <div className="flex flex-col justify-center items-center md:space-y-[52px] md:my-[52px]">
        <h1 className="font-normal md:text-[28px]">{t("title")}</h1>

        {/* -------- TABS -------- */}
        <div className="sticky top-[73px] bg-white z-50 border-y border-y-[#EEF2F6] w-full">
          <div className="flex justify-center gap-[40px] relative">
            {tabs.map((tab) => {
              const isActive = tab.id === active;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    "relative py-[24px] text-[14px] font-normal text-[#1D1D1F] transition-colors cursor-pointer",
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
        <div className="w-full flex justify-center">
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
