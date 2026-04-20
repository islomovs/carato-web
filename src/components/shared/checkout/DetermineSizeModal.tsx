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
import { CategorySize } from "@/services/product";

interface DetermineSizeModalProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  categorySizes?: CategorySize[];
  categoryName?: string;
  /** Subcategory slug (preferred) or category slug — used to pick the correct measurement guide */
  categorySlug?: string;
  /** Set by backend: "ring" | "bracelet" | "necklace" | "clothing" | null  (TODO: add to backend) */
  sizeGuideType?: string | null;
}

/* ─── Guide detection ───────────────────────────────────────────────────── */
type GuideType = "ring" | "bracelet" | "necklace" | "default";

function detectGuideType(
  sizeGuideType?: string | null,
  slug?: string,
): GuideType {
  // Prefer explicit backend field once it exists
  if (sizeGuideType) {
    const t = sizeGuideType.toLowerCase();
    if (t === "ring") return "ring";
    if (t === "bracelet") return "bracelet";
    if (t === "necklace") return "necklace";
  }
  // Fallback: detect from slug
  if (!slug) return "default";
  const s = slug.toLowerCase();
  if (/kolc|ring|koltso|persten/.test(s)) return "ring";
  if (/braslet|bracelet|bangle/.test(s)) return "bracelet";
  if (/ozherel|necklace|tsep|kole|chain|kulony|kulon/.test(s)) return "necklace";
  return "default";
}

/* ─── Closest-size matching ─────────────────────────────────────────────── */
function findClosestSize(
  input: string,
  sizes: CategorySize[],
): CategorySize | null {
  const num = parseFloat(input.replace(",", "."));
  if (isNaN(num) || sizes.length === 0) return null;

  return sizes.reduce((best, curr) => {
    const currNum = parseFloat(curr.name.replace(",", "."));
    const bestNum = parseFloat(best.name.replace(",", "."));
    if (isNaN(currNum)) return best;
    if (isNaN(bestNum)) return curr;
    return Math.abs(currNum - num) <= Math.abs(bestNum - num) ? curr : best;
  });
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function DetermineSizeModal({
  open,
  onOpenChange,
  categorySizes,
  categoryName,
  categorySlug,
  sizeGuideType,
}: DetermineSizeModalProps) {
  const t = useTranslations("product");
  const [mmInput, setMmInput] = useState("");
  const [matchedSize, setMatchedSize] = useState<CategorySize | null>(null);
  const [error, setError] = useState<string | null>(null);

  const guideType = detectGuideType(sizeGuideType, categorySlug);

  /* Step definitions per guide type */
  const firstStepText: Record<GuideType, string> = {
    ring: t("wrapFinger"),
    bracelet: t("wrapWrist"),
    necklace: t("wrapNeck"),
    default: t("wrapBody"),
  };

  const steps = [
    { icon: "/icons/ruler.svg", text: firstStepText[guideType] },
    { icon: "/icons/bezier-curve.svg", text: t("markMeetingPoint") },
    { icon: "/icons/compass.svg", text: t("measureLength") },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMmInput(value);

    if (value.trim() === "") {
      setMatchedSize(null);
      setError(null);
      return;
    }

    const num = parseFloat(value.replace(",", "."));
    if (isNaN(num)) {
      setMatchedSize(null);
      setError(t("invalidMeasurement"));
      return;
    }

    if (categorySizes && categorySizes.length > 0) {
      // Always find closest — no "not found" errors for valid numbers
      const match = findClosestSize(value, categorySizes);
      setMatchedSize(match);
      setError(null);
    } else {
      // No size list configured — just echo what the user typed
      setMatchedSize({ id: 0, name: value.trim() });
      setError(null);
    }
  };

  const sizeLabel = matchedSize
    ? `${t("yourSize")} ${categoryName ? `(${categoryName}) ` : ""}${matchedSize.name}`
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full md:max-w-[520px] md:!rounded-2xl flex flex-col md:gap-10
  overflow-y-auto md:max-h-[90vh] md:!p-10 !p-0 rounded-none max-w-none
  !h-[100dvh] md:!h-auto !max-h-none !gap-0 !overflow-hidden z-[80]"
      >
        <div className="md:hidden relative h-[64px] border-b border-[#EEF2F6] flex items-center justify-center" />

        <DialogHeader className="my-8 md:mt-0 md:mb-10">
          <DialogTitle className="px-4 text-start text-[24px] font-normal text-black">
            {t("defineYourSize")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4">
          <div className="flex flex-col gap-6">
            {/* Measurement steps */}
            {steps.map(({ icon, text }, i) => (
              <div key={i} className="flex items-center">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#EEF2F6] rounded-[4px]">
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

            {/* Input */}
            <div>
              <Label
                htmlFor="mm-size"
                className="text-[12px] text-[#697586] mb-2 block"
              >
                {t("enterSizeInMm")}
              </Label>
              <Input
                id="mm-size"
                placeholder={t("mmPlaceholder")}
                value={mmInput}
                onChange={handleChange}
                inputMode="decimal"
              />
              <div className="mt-2 min-h-[20px]">
                {sizeLabel && (
                  <p className="text-[#697586] font-normal text-[12px]">
                    {sizeLabel}
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
