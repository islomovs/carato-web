"use client";

import { useState, useId } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { withMask } from "use-mask-input";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface SizeModalsProps {
  openNotify: boolean;
  setOpenNotify: (val: boolean) => void;
  openDetermine: boolean;
  setOpenDetermine: (val: boolean) => void;
}

export default function SizeModals({
  openNotify,
  setOpenNotify,
  openDetermine,
  setOpenDetermine,
}: SizeModalsProps) {
  const t = useTranslations("product");
  const [size, setSize] = useState("");
  const [mmSize, setMmSize] = useState("");
  const id = useId();
  const [definedSize, setDefinedSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const validSizes = ["155", "160", "165", "170", "175"];
  const availableSizes = ["155", "160", "165", "170", "175"];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMmSize(value);

    if (validSizes.includes(value)) {
      setDefinedSize(value);
      setError(null);
    } else {
      setDefinedSize(null);
      setError(value.length > 0 ? "Размер недоступен" : null);
    }
  };

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

  return (
    <>
      {/* ---------- МОДАЛКА 1: УВЕДОМИТЬ О НАЛИЧИИ ---------- */}
      <Dialog open={openNotify} onOpenChange={setOpenNotify}>
        <DialogContent className="w-full max-w-[520px] p-10 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-normal text-black">
              {t("notifySize")}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 flex flex-col gap-8">
            <div>
              <Label
                htmlFor="size"
                className="text-[12px] text-[#697586] mb-2 block"
              >
                {t("requiredSize")}
                <span className="text-red-600 ml-[2px]">*</span>
              </Label>

              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите размер" />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor={`${id}-phone`}
                className="text-[12px] text-[#697586] mb-2 block"
              >
                {t("phoneNumber")}
                <span className="text-red-600 ml-[2px]">*</span>
              </Label>
              <Input
                id={`${id}-phone`}
                type="text"
                placeholder="+998 90 123-45-67"
                ref={withMask("+\\9\\9\\8 99 999-99-99", {
                  placeholder: "_",
                  showMaskOnHover: false,
                })}
                className="w-full"
              />
            </div>

            <Button className="w-full bg-black text-white h-[52px] text-[14px] uppercase rounded-md">
              {t("notifyMe")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------- МОДАЛКА 2: ОПРЕДЕЛИТЬ РАЗМЕР ---------- */}
      <Dialog open={openDetermine} onOpenChange={setOpenDetermine}>
        <DialogContent className="w-full max-w-[520px] p-10 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-normal text-black">
              {t("defineYourSize")}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 flex flex-col gap-6">
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

            <div className="mt-6">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
