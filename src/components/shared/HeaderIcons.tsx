import Image from "next/image";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";

type HeaderIconsProps = {
  setAuthOpen: (val: boolean) => void;
  setSearchOpen?: (val: boolean) => void;
};

export default function HeaderIcons({
  setAuthOpen,
  setSearchOpen,
}: HeaderIconsProps) {
  const router = useRouter();

  const icons = [
    {
      icon: "/icons/search.svg",
      action: () => setSearchOpen?.(true),
    },
    {
      icon: "/icons/shopping-bag.svg",
      action: () => router.push("/cart"),
    },
    {
      icon: "/icons/heart.svg",
      action: () => router.push("/wishlist"),
    },
    {
      icon: "/icons/user.svg",
      action: () => setAuthOpen(true),
    },
  ];

  return (
    <div className="hidden md:flex items-center gap-2">
      {icons.map((item, idx) => (
        <button
          key={idx}
          aria-label={`icon-${idx}`}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer"
          onClick={item.action}
        >
          <Image src={item.icon} alt={`icon-${idx}`} width={16} height={16} />
        </button>
      ))}

      <LanguageSwitcher />
    </div>
  );
}
