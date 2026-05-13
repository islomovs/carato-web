"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import useLockScroll from "@/hooks/useLockScroll";

const languages = [
  {
    code: "uz",
    label: "Oʻzbek",
    flag: "/images/uz-flag.png",
  },
  {
    code: "ru",
    label: "Русский",
    flag: "/images/ru-flag.png",
  },
];

export function LanguageSwitcher() {
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLocale = (code: string) => {
    const segments = pathname.split("/");
    segments[1] = code;
    const newPath = segments.join("/");
    router.push(newPath);
  };

  const [isOpened, setIsOpened] = React.useState(false);

  useLockScroll(isOpened);

  return (
    <DropdownMenu onOpenChange={setIsOpened}>
      <DropdownMenuTrigger
        asChild
        className="hover:bg-[#EEF2F6] cursor-pointer !h-9 !w-9 border-0"
      >
        <Button
          variant="ghost"
          className={`!h-9 !w-9 p-0 flex items-center justify-center 
            bg-transparent shadow-none cursor-pointer border-0
            focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none
            data-[state=open]:bg-[#EEF2F6] hover:bg-[#EEF2F6]`}
        >
          <Image
            src={languages.find((l) => l.code === current)?.flag || ""}
            alt={current}
            width={20}
            height={20}
            className="rounded-full w-5 h-5 object-cover border-[#00000014] border-[0.83px]"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40 px-3">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChangeLocale(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Image
                src={lang.flag}
                alt={lang.code}
                width={20}
                height={20}
                className="rounded-full w-5 h-5 object-cover"
              />
              <span>{lang.label}</span>
            </div>
            {current === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
