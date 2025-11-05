"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ShareDropdown() {
  const t = useTranslations("product");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options = [
    { label: t("copy"), icon: "/icons/copy.svg" },
    { label: "Telegram", icon: "/icons/telegram.svg" },
    { label: "Facebook", icon: "/icons/facebook.svg" },
    { label: "Instagram", icon: "/icons/instagram.svg" },
  ];
  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        onClick={() => setOpen(!open)}
        className="w-[52px] h-[52px] flex items-center justify-center border border-black rounded-md bg-white cursor-pointer"
      >
        <Image src="/icons/share.svg" alt="Share" width={20} height={20} />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-[200px] bg-white border border-[#EEF2F6] rounded-md shadow-lg z-50 py-3">
          {options.map((opt) => (
            <Button
              variant="ghost"
              key={opt.label}
              className="flex items-center justify-start gap-3 px-6 py-3 w-full cursor-pointer uppercase"
              onClick={() => {
                if (opt.label === t("copy")) {
                  navigator.clipboard.writeText(window.location.href);
                }
                setOpen(false);
              }}
            >
              <Image src={opt.icon} alt={opt.label} width={20} height={20} />
              <span className="font-[400] text-[14px]">{opt.label}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
