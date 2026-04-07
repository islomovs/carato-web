import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type MobileMenuProps = {
  currentLang: string;
  setLangModalOpen: (val: boolean) => void;
  closeMenu: () => void;
  HEADER_HEIGHT_PX: number;
  APPBAR_HEIGHT_PX: number;
};

export default function MobileMenu({
  currentLang,
  setLangModalOpen,
  closeMenu,
  HEADER_HEIGHT_PX,
  APPBAR_HEIGHT_PX,
}: MobileMenuProps) {
  const t = useTranslations("home.header");
  const mobileMenuItems = [
    { title: t("catalog"), icon: "/icons/grid.svg", href: "/catalog" },
    { title: t("shops"), icon: "/icons/shop.svg", href: "/shops" },
    { title: t("about"), icon: "/icons/about.svg", href: "/about" },
    { title: t("wishlist"), icon: "/icons/heart.svg", href: "/wishlist" },
    { title: t("cart"), icon: "/icons/shopping-bag.svg", href: "/cart" },
    { title: t("news"), icon: "/icons/book.svg", href: "/news" },
    {
      title: t("forPartners"),
      icon: "/icons/coins-hand.svg",
      href: "/partners",
    },
    { title: t("qna"), icon: "/icons/help-circle.svg", href: "/qa" },
    { title: t("phone"), icon: "/icons/phone.svg", href: "/about" },
  ];

  const socialIcons = [
    { src: "/icons/telegram.svg", alt: "Telegram", href: "#" },
    { src: "/icons/facebook.svg", alt: "Facebook", href: "#" },
    { src: "/icons/instagram.svg", alt: "Instagram", href: "#" },
    { src: "/icons/youtube.svg", alt: "YouTube", href: "#" },
  ];

  return (
    <motion.div
      key="mobile-menu"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      style={{ top: HEADER_HEIGHT_PX, bottom: APPBAR_HEIGHT_PX }}
      className="fixed left-0 right-0 z-40 bg-white flex flex-col justify-between overflow-hidden"
    >
      <div className="overflow-y-auto py-2">
        {mobileMenuItems.map(({ title, icon, href }, idx) => (
          <Link
            key={`${title}-${idx}`}
            href={href}
            onClick={closeMenu}
            className="flex items-center gap-4 px-4 py-3"
          >
            <Image src={icon} alt={title} width={20} height={20} />
            <span className="text-[14px] font-[400] text-gray-900">
              {title}
            </span>
          </Link>
        ))}

        <button
          onClick={() => setLangModalOpen(true)}
          className="flex items-center gap-4 px-4 py-3 w-full text-left"
        >
          <Image
            src={
              currentLang === "ru"
                ? "/images/ru-flag.png"
                : "/images/uz-flag.png"
            }
            alt={currentLang}
            width={20}
            height={20}
            className="rounded-full w-5 h-5 object-cover border-[#00000014] border-[0.83px]"
          />
          <span className="text-[14px] font-[400] text-gray-900">
            {currentLang === "ru" ? "Русский" : "Oʻzbek"}
          </span>
        </button>
      </div>

      <div className="absolute left-0 right-0 bottom-[24px] flex flex-col items-center">
        <div className="flex items-center gap-6 justify-center mb-8">
          {socialIcons.map(({ src, alt, href }) => (
            <Link key={alt} href={href} onClick={closeMenu}>
              <Image src={src} alt={alt} width={20} height={20} />
            </Link>
          ))}
        </div>
        <p className="text-lg font-[300] uppercase text-gray-500 text-center">
          © 2025. Carato Jewellery Official
        </p>
      </div>
    </motion.div>
  );
}
