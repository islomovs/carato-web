import Image from "next/image";

interface FilterHeaderProps {
  variant: "desktop" | "mobile";
  onClose: () => void;
  onBack?: () => void;
  activeFilter?: string | null;
}

export default function FilterHeader({
  variant,
  onClose,
  onBack,
  activeFilter,
}: FilterHeaderProps) {
  if (variant === "desktop") {
    return (
      <div className="relative px-10 pt-10 pb-5 border-b border-[#EEF2F6]">
        <h2 className="text-[24px] font-[400] leading-[28px]">Фильтры</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:opacity-70 transition cursor-pointer w-9 h-9 flex items-center justify-center"
        >
          <Image src="/icons/x-close.svg" alt="Close" width={20} height={20} />
        </button>
      </div>
    );
  }

  // MOBILE HEADER
  return (
    <div className="flex items-center justify-center relative h-[56px] border-b border-[#EEF2F6] px-4">
      {activeFilter && (
        <button
          onClick={onBack}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center"
        >
          <Image
            src="/icons/arrow-narrow-left.svg"
            alt="back"
            width={20}
            height={20}
          />
        </button>
      )}

      <span className="font-[300] text-[14px] text-center">
        {activeFilter ? activeFilter : "Фильтры"}
      </span>

      <button
        onClick={onClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center"
      >
        <Image src="/icons/x-close.svg" alt="close" width={20} height={20} />
      </button>
    </div>
  );
}
