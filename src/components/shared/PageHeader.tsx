import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface PageHeaderProps {
  title: string;

  // callbacks
  onBack?: () => void;
  onClose?: () => void;

  // layout modes
  centeredTitle?: boolean; // title center on mobile (Cart, DateTime, Address)
  absoluteClose?: boolean; // close button absolute (layers)
  showDesktopButton?: boolean; // checkout page desktop back button
  className?: string; // custom wrapper class
}

export default function PageHeader({
  title,
  onBack,
  onClose,
  centeredTitle = true,
  absoluteClose = false,
  showDesktopButton = false,
  className = "",
}: PageHeaderProps) {
  const t = useTranslations("checkout");
  return (
    <div
      className={`sticky top-0 z-50 bg-white flex items-center 
      px-2 py-[22px] border-b md:px-4 border-[#EEF2F6] ${className}
      md:border-0`}
    >
      {/* Mobile back */}
      {onBack && (
        <button
          className="md:hidden w-5 h-5 flex items-center justify-center cursor-pointer absolute top-[22px] left-[22px]"
          onClick={onBack}
          aria-label={t("back")}
        >
          <Image
            src="/icons/arrow-narrow-left.svg"
            alt={t("back")}
            width={20}
            height={20}
          />
        </button>
      )}

      {/* Desktop back button (Checkout only) */}
      {showDesktopButton && (
        <Button
          type="button"
          variant="outline"
          className="p-2 cursor-pointer hidden md:flex items-center"
          onClick={onBack}
        >
          <Image
            src="/icons/arrow-narrow-left.svg"
            alt="Back"
            width={20}
            height={20}
          />
          {t("back")}
        </Button>
      )}

      {/* Title */}
      <h2
        className={`text-sm md:text-2xl md:font-normal font-light flex-1 
        ${centeredTitle ? "text-center md:text-left" : "text-left"}`}
      >
        {title}
      </h2>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className={`w-5 h-5 flex items-center justify-center cursor-pointer
          ${absoluteClose ? "absolute top-[22px] right-[22px]" : ""}`}
          aria-label={t("close")}
        >
          <Image
            src="/icons/x-close.svg"
            alt={t("close")}
            width={20}
            height={20}
          />
        </button>
      )}
    </div>
  );
}
