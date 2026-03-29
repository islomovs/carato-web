import Image from "next/image";

interface Props {
  title: string;
  options: string[];
  isOptionActive: (title: string, opt: string) => boolean;
  toggleOption: (title: string, opt: string) => void;
  isSingleSelect?: boolean;
}

export default function FilterOptionsList({
  title,
  options,
  isOptionActive,
  toggleOption,
  isSingleSelect = false,
}: Props) {
  return (
    <div className="flex flex-col">
      {options.map((option) => {
        const active = isOptionActive(title, option);
        return (
          <button
            key={option}
            onClick={() => toggleOption(title, option)}
            className="relative text-left py-2 text-[14px] font-[400] text-[#4B5565] flex justify-between items-center"
          >
            {option}
            {isSingleSelect ? (
              <span
                className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors duration-150
                  ${active ? "border-black bg-black" : "border-[#9AA4B2]"}`}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            ) : (
              active && (
                <Image
                  src="/icons/check.svg"
                  alt="check"
                  width={16}
                  height={16}
                />
              )
            )}
          </button>
        );
      })}
    </div>
  );
}
