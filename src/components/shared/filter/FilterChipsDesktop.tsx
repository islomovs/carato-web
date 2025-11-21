import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function FilterChipsDesktop({
  hasFilters,
  selectedFilters,
  handleRemove,
  handleClearAll,
}: {
  hasFilters: boolean;
  selectedFilters: Record<string, string[]>;
  handleRemove: (title: string, option: string) => void;
  handleClearAll: () => void;
}) {
  return (
    <div className="md:px-8 py-3 border-t border-[#EEF2F6] bg-white">
      {/* Mobile horizontal scroll / Desktop wraps */}
      <div className="overflow-x-auto md:overflow-visible">
        <div
          className="flex gap-3 md:flex-wrap pl-4 md:pl-0 mobile-scroll no-scrollbar"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {Object.entries(selectedFilters).map(([title, options]) =>
            options.map((option) => (
              <button
                key={`${title}-${option}`}
                onClick={() => handleRemove(title, option)}
                className="flex items-center gap-2 bg-[#EEF2F6] px-2 py-1 rounded text-[12px] font-[400] uppercase text-[#4B5565] cursor-pointer flex-shrink-0"
              >
                {option}
                <span>
                  <Image
                    src="/icons/x-close.svg"
                    alt="remove"
                    width={20}
                    height={20}
                  />
                </span>
              </button>
            ))
          )}

          {/* “Очистить всё” — visible only on desktop */}
          {hasFilters && (
            <Button
              variant="link"
              onClick={handleClearAll}
              className="hidden md:inline-block px-[14px] py-[8px] text-[12px] font-[400] uppercase text-[#4B5565] cursor-pointer flex-shrink-0"
            >
              ОЧИСТИТЬ ВСЁ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
