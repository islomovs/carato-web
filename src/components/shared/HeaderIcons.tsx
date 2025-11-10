import Image from "next/image";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";

type HeaderIconsProps = {
  icons: string[];
  setAuthOpen: (val: boolean) => void;
};

export default function HeaderIcons({ icons, setAuthOpen }: HeaderIconsProps) {
  return (
    <>
      <div className="hidden md:flex items-center gap-2">
        {icons.map((src, idx) => (
          <button
            key={idx}
            aria-label="icon"
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer"
            onClick={() => setAuthOpen(true)}
          >
            <Image src={src} alt={`icon-${idx}`} width={16} height={16} />
          </button>
        ))}
        <LanguageSwitcher />
      </div>
    </>
  );
}
