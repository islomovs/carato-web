"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const languages = [
  { code: "uz", label: "Oʻzbek", flag: "/images/uz-flag.png" },
  { code: "ru", label: "Русский", flag: "/images/ru-flag.png" },
];

export default function MobileLanguageModal({
  open,
  onClose,
  currentLang,
  setCurrentLang,
}: {
  open: boolean;
  onClose: () => void;
  currentLang: string;
  setCurrentLang: (code: string) => void;
}) {
  const t = useTranslations("");
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLocale = (code: string) => {
    setCurrentLang(code);
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#00000066] z-50"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 100 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 60) onClose();
            }}
            className="fixed left-0 right-0 bottom-0 z-[60] bg-white rounded-t-[24px] shadow-lg"
          >
            <div className="p-4">
              {/* Title */}
              <h3 className="text-[24px] font-[400] text-black mb-4">
                {t("home.header.language")}
              </h3>

              {/* Language list */}
              <div className="flex flex-col">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleChangeLocale(lang.code)}
                    className="relative flex items-center justify-between py-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={lang.flag}
                        alt={lang.code}
                        width={20}
                        height={20}
                        className="rounded-full w-5 h-5 object-cover border-[#00000014] border-[0.83px]"
                      />
                      <span className="text-[16px] text-black font-[400]">
                        {lang.label}
                      </span>
                    </div>

                    {currentLang === lang.code && (
                      <Check
                        size={20}
                        className="text-black absolute right-4"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
