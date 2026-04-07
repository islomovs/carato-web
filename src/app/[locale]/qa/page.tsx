"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchAllQA, QAItem } from "@/services/qa";


function QAAccordionItem({ item }: { item: QAItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-[#EEF2F6] cursor-pointer"
      onClick={() => setOpen((p) => !p)}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <p
          style={{
            fontWeight: 400,
            fontSize: 14,
            lineHeight: "20px",
            flex: 1,
            paddingRight: 12,
          }}
        >
          {item.title}
        </p>
        {open ? (
          <ChevronUp className="w-5 h-5 flex-shrink-0 text-black" />
        ) : (
          <ChevronDown className="w-5 h-5 flex-shrink-0 text-black" />
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p
              className="px-4 pb-4"
              style={{
                fontWeight: 300,
                fontSize: 14,
                lineHeight: "20px",
                marginTop: -4, // visually 12px below title
                paddingTop: 0,
              }}
            >
              {item.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const tabs = [{ id: "faq", labelKey: "frequentQuestions" }];

export default function QAPage() {
  const t = useTranslations("qa");
  const locale = useLocale();
  const [active, setActive] = useState("faq");
  const [items, setItems] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllQA(locale)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <div className="flex flex-col items-center w-full mb-[160px] mt-16 md:mt-0">
      {/* Title */}
      <h1
        className="w-full text-center font-normal text-[24px] md:text-[28px] leading-[34px]"
        style={{ paddingTop: 32, paddingBottom: 32 }}
      >
        {t("title")}
      </h1>

      {/* Tabs — sticky */}
      <div className="sticky top-0 md:top-16 bg-white z-30 border-y border-[#EEF2F6] w-full">
        <div className="flex justify-center px-4 items-center md:gap-10 relative">
          {tabs.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "relative py-6 text-[14px] font-normal transition-colors cursor-pointer",
                  isActive ? "font-medium text-[#1D1D1F]" : "text-[#697586]",
                )}
              >
                {t(tab.labelKey)}
                {isActive && (
                  <motion.div
                    layoutId="qa-underline"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute left-0 right-0 -bottom-[1px] h-[0.5px] bg-black"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="w-full md:max-w-[910px]" style={{ marginTop: 32 }}>
        {loading ? (
          <div className="flex flex-col">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-b border-[#EEF2F6] px-4 py-4">
                <div className="h-4 bg-[#EAECF0] rounded animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {items.map((item) => (
              <QAAccordionItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
