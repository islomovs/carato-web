import Image from "next/image";

interface Props {
  title: string;
  options: string[];
  isOptionActive: (title: string, opt: string) => boolean;
  toggleOption: (title: string, opt: string) => void;
}

export default function FilterOptionsList({
  title,
  options,
  isOptionActive,
  toggleOption,
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
            {active && (
              <Image
                src="/icons/check.svg"
                alt="check"
                width={16}
                height={16}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
