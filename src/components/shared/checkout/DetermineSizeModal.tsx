"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

interface DetermineSizeModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export default function DetermineSizeModal({
  open,
  onOpenChange,
}: DetermineSizeModalProps) {
  const t = useTranslations("product");
  const [mmSize, setMmSize] = useState("");
  const [definedSize, setDefinedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
      {
        icon: "/icons/ruler.svg",
        text: t("wrapFinger"),
      },
      {
        icon: "/icons/bezier-curve.svg",
        text: t("markMeetingPoint"),
      },
      {
        icon: "/icons/compass.svg",
        text: t("measureLength"),
      },
    ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMmSize(value);
    setDefinedSize(
      ["155", "160", "165", "170", "175"].includes(value) ? value : null
    );
    setError(
      !["155", "160", "165", "170", "175"].includes(value) && value.length > 0
        ? "Размер недоступен"
        : null
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full md:max-w-[520px] md:!rounded-2xl flex flex-col md:gap-10
  overflow-y-auto md:max-h-[90vh] md:!p-10 !p-0 rounded-none max-w-none
  !h-[100dvh] md:!h-auto !max-h-none !gap-0 !overflow-hidden z-[80]"
      >
        <div className="md:hidden relative h-[64px] border-b border-[#EEF2F6] flex items-center justify-center"></div>
        <DialogHeader className="my-8 md:mt-0 md:mb-10">
          <DialogTitle className="px-4 text-start text-[24px] font-normal text-black">
            {t("defineYourSize")}
          </DialogTitle>
        </DialogHeader>
        <div className="px-4">
          <div className="flex flex-col gap-6">
            {steps.map(({ icon, text }, i) => (
              <div key={i} className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-[#EEF2F6] rounded-[4px]">
                  <Image
                    src={icon}
                    alt={text}
                    width={20}
                    height={20}
                    className="text-black"
                  />
                </div>
                <p className="ml-4 text-[18px] font-light text-black leading-[22px]">
                  {text}
                </p>
              </div>
            ))}

            <div>
              <Label
                htmlFor="mm-size"
                className="text-[12px] text-[#697586] mb-2 block"
              >
                Введите размер в миллиметрах
              </Label>
              <Input
                id="mm-size"
                placeholder="Например: 165"
                value={mmSize}
                onChange={handleChange}
              />
              <div className="mt-2 h-[20px]">
                {definedSize && (
                  <p className="text-[#697586] font-normal text-[12px]">
                    Размер кольца: {definedSize}
                  </p>
                )}
                {error && (
                  <p className="text-red-600 font-normal text-[12px]">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
