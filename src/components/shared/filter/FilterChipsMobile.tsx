/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";

export default function FilterChipsMobile({
  selected,
  setSelected,
  price,
}: {
  selected: Record<string, (string | number)[]>;
  setSelected: any;
  price: [number, number];
}) {
  const priceChipText = () => `${price[0]} — ${price[1]} сум`;

  return (
    <div className="border-t border-[#EEF2F6]">
      <div className="relative">
        {/* Fade overlay effect (optional, for nice edge look)
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" /> */}

        <div
          className="flex overflow-x-auto py-2 px-0"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {/* Hide webkit scrollbar */}
          <style>{`.mobile-chips::-webkit-scrollbar { display: none; }`}</style>

          <div className="mobile-chips flex gap-3 pl-4 pr-4">
            {Object.entries(selected).map(([title, options]) =>
              options.map((option) => (
                <button
                  key={`${title}-${option}`}
                  onClick={() => {
                    setSelected((prev: any) => {
                      const newOptions =
                        prev[title]?.filter(
                          (o: string | number) => o !== option
                        ) ?? [];
                      const copy = { ...prev, [title]: newOptions };
                      if (newOptions.length === 0) delete copy[title];
                      return copy;
                    });
                  }}
                  className="flex items-center gap-2 bg-[#EEF2F6] px-3 py-2 rounded text-[12px] font-[400] uppercase text-[#4B5565] whitespace-nowrap flex-shrink-0"
                >
                  <span className="truncate max-w-[calc(100%-24px)]">
                    {title === "Цена" ? priceChipText() : option}
                  </span>
                  <Image
                    src="/icons/x-close.svg"
                    alt="remove"
                    width={20}
                    height={20}
                  />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
