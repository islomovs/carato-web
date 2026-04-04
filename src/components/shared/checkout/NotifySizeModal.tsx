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
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { withMask } from "use-mask-input";

interface NotifySizeModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}

export default function NotifySizeModal({
  open,
  onOpenChange,
}: NotifySizeModalProps) {
  const t = useTranslations("product");
  const [size, setSize] = useState("");
  const id = useId();

  const availableSizes = ["155", "160", "165", "170", "175"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full md:max-w-[520px] md:!rounded-2xl flex flex-col md:gap-10
  overflow-y-auto md:max-h-[90vh] md:!p-10 !p-0 rounded-none max-w-none
  !h-[100dvh] md:!h-auto !max-h-none !gap-0 !overflow-hidden z-[80]"
      >
        <div className="md:hidden relative h-[64px] border-b border-[#EEF2F6] flex items-center justify-center">
          {/* Center the built-in close button */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {/* This will be where the default DialogClose button is rendered */}
          </div>
        </div>

        <DialogHeader className="my-8 md:mt-0 md:mb-10">
          <DialogTitle className="px-4 text-start text-[24px] font-normal text-black">
            {t("notifySize")}
          </DialogTitle>
        </DialogHeader>
        <div className="px-4">
          <div className="flex flex-col gap-8">
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
                <SelectContent className="z-[80]">
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

            <Button className="cursor-pointer w-full bg-black text-white h-[52px] text-[14px] uppercase rounded-md">
              {t("notifyMe")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
