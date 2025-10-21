"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { NavButton } from "../ui/nav-button";
import CatalogDropdown from "./CatalogDropdown";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import MobileLanguageModal from "../shared/MobileLanguageModal";

export default function Header() {
  const t = useTranslations("home.header");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("skincare");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("uz");

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const icons = [
    "/icons/search.svg",
    "/icons/shopping-bag.svg",
    "/icons/heart.svg",
    "/icons/user.svg",
  ];

const categories = [
  {
    id: "skincare",
    name: "Уход за лицом",
    sub: [
      {
        name: "Кремы",
        img: "/images/cream.png",
        subsub: [
          { name: "Дневные кремы", img: "/images/day-cream.png" },
          { name: "Ночные кремы", img: "/images/night-cream.png" },
          { name: "Крема с SPF", img: "/images/spf-cream.png" },
          {
            name: "Антивозрастные кремы",
            img: "/images/anti-aging-cream.png",
          },
          { name: "Увлажняющие кремы", img: "/images/moist-cream.png" },
          { name: "Матирующие кремы", img: "/images/matt-cream.png" },
        ],
      },
      {
        name: "Маски",
        img: "/images/mask.png",
        subsub: [
          { name: "Тканевые маски", img: "/images/sheet-mask.png" },
          { name: "Глиняные маски", img: "/images/clay-mask.png" },
        ],
      },
      {
        name: "Сыворотки",
        img: "/images/serum.png",
        subsub: [
          { name: "С ниацинамидом", img: "/images/niacinamide.png" },
          { name: "С гиалуроновой кислотой", img: "/images/hyaluronic.png" },
          { name: "С витамином С", img: "/images/vitamin-c.png" },
        ],
      },
      {
        name: "Тонеры",
        img: "/images/toner.png",
        subsub: [
          { name: "Очищающие", img: "/images/cleansing-toner.png" },
          { name: "Увлажняющие", img: "/images/moist-toner.png" },
        ],
      },
      {
        name: "Кремы1",
        img: "/images/cream.png",
        subsub: [
          { name: "Дневные кремы", img: "/images/day-cream.png" },
          { name: "Ночные кремы", img: "/images/night-cream.png" },
          { name: "Крема с SPF", img: "/images/spf-cream.png" },
          {
            name: "Антивозрастные кремы",
            img: "/images/anti-aging-cream.png",
          },
          { name: "Увлажняющие кремы", img: "/images/moist-cream.png" },
          { name: "Матирующие кремы", img: "/images/matt-cream.png" },
        ],
      },
      {
        name: "Маски2",
        img: "/images/mask.png",
        subsub: [
          { name: "Тканевые маски", img: "/images/sheet-mask.png" },
          { name: "Глиняные маски", img: "/images/clay-mask.png" },
        ],
      },
      {
        name: "Сыворотки2",
        img: "/images/serum.png",
        subsub: [
          { name: "С ниацинамидом", img: "/images/niacinamide.png" },
          { name: "С гиалуроновой кислотой", img: "/images/hyaluronic.png" },
          { name: "С витамином С", img: "/images/vitamin-c.png" },
        ],
      },
      {
        name: "Тонеры2",
        img: "/images/toner.png",
        subsub: [
          { name: "Очищающие", img: "/images/cleansing-toner.png" },
          { name: "Увлажняющие", img: "/images/moist-toner.png" },
        ],
      },
    ],
  },
  {
    id: "haircare1",
    name: "Уход за волосами",
    sub: [
      {
        name: "Шампуни",
        img: "/images/shampoo.png",
        subsub: [
          { name: "Для сухих волос", img: "/images/dry-shampoo.png" },
          { name: "Для жирных волос", img: "/images/oily-shampoo.png" },
          { name: "Для окрашенных волос", img: "/images/color-shampoo.png" },
        ],
      },
      {
        name: "Маски для волос",
        img: "/images/hair-mask.png",
        subsub: [
          { name: "Питательные", img: "/images/nourish-mask.png" },
          { name: "Восстанавливающие", img: "/images/repair-mask.png" },
          { name: "Увлажняющие", img: "/images/moist-hair-mask.png" },
        ],
      },
    ],
  },
  {
    id: "skincare2",
    name: "Уход за лицом",
    sub: [
      {
        name: "Кремы",
        img: "/images/cream.png",
        subsub: [
          { name: "Дневные кремы", img: "/images/day-cream.png" },
          { name: "Ночные кремы", img: "/images/night-cream.png" },
          { name: "Крема с SPF", img: "/images/spf-cream.png" },
          {
            name: "Антивозрастные кремы",
            img: "/images/anti-aging-cream.png",
          },
          { name: "Увлажняющие кремы", img: "/images/moist-cream.png" },
          { name: "Матирующие кремы", img: "/images/matt-cream.png" },
        ],
      },
      {
        name: "Маски",
        img: "/images/mask.png",
        subsub: [
          { name: "Тканевые маски", img: "/images/sheet-mask.png" },
          { name: "Глиняные маски", img: "/images/clay-mask.png" },
        ],
      },
      {
        name: "Сыворотки",
        img: "/images/serum.png",
        subsub: [
          { name: "С ниацинамидом", img: "/images/niacinamide.png" },
          { name: "С гиалуроновой кислотой", img: "/images/hyaluronic.png" },
          { name: "С витамином С", img: "/images/vitamin-c.png" },
        ],
      },
      {
        name: "Тонеры",
        img: "/images/toner.png",
        subsub: [
          { name: "Очищающие", img: "/images/cleansing-toner.png" },
          { name: "Увлажняющие", img: "/images/moist-toner.png" },
        ],
      },
    ],
  },
  {
    id: "haircare2",
    name: "Уход за волосами",
    sub: [
      {
        name: "Шампуни",
        img: "/images/shampoo.png",
        subsub: [
          { name: "Для сухих волос", img: "/images/dry-shampoo.png" },
          { name: "Для жирных волос", img: "/images/oily-shampoo.png" },
          { name: "Для окрашенных волос", img: "/images/color-shampoo.png" },
        ],
      },
      {
        name: "Маски для волос",
        img: "/images/hair-mask.png",
        subsub: [
          { name: "Питательные", img: "/images/nourish-mask.png" },
          { name: "Восстанавливающие", img: "/images/repair-mask.png" },
          { name: "Увлажняющие", img: "/images/moist-hair-mask.png" },
        ],
      },
    ],
  },
];

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
    { title: t("qna"), icon: "/icons/help-circle.svg", href: "/q-and-a" },
    { title: t("phone"), icon: "/icons/phone.svg", href: "/about" },
  ];

  const socialIcons = [
    { src: "/icons/telegram.svg", alt: "Telegram", href: "#" },
    { src: "/icons/facebook.svg", alt: "Facebook", href: "#" },
    { src: "/icons/instagram.svg", alt: "Instagram", href: "#" },
    { src: "/icons/youtube.svg", alt: "YouTube", href: "#" },
  ];

  // header/appbar heights — adjust to your actual sizes if different
  const HEADER_HEIGHT_PX = 64; // header height (desktop & mobile)
  const APPBAR_HEIGHT_PX = 64; // bottom app bar height

  return (
    <header className="relative w-full border-b border-[#EEF2F6] bg-white px-2 md:px-8">
      <div className="container flex items-center justify-between py-2">
        {/* Left side: mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="menu"
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer"
          >
            <Image
              src={menuOpen ? "/icons/x-close.svg" : "/icons/menu.svg"}
              alt="menu"
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center justify-center gap-6 text-sm h-10 mt-2">
          <Link href="/shops">
            <NavButton>{t("shops")}</NavButton>
          </Link>
          <Link href="/about">
            <NavButton>{t("about")}</NavButton>
          </Link>
          <NavButton
            onClick={() => setIsCatalogOpen((prev) => !prev)}
            active={isCatalogOpen}
          >
            {t("catalog")}
          </NavButton>
        </nav>

        <Link
          href="/"
          className="text-lg md:text-xl font-semibold flex items-center"
          style={{ paddingTop: 8, paddingBottom: 8 }}
        >
          <Image
            src="/images/logo.png"
            alt="Carato"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          {/* Mobile: bag + search */}
          <div className="flex md:hidden items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer">
              <Image
                src="/icons/search.svg"
                alt="search"
                width={20}
                height={20}
              />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer">
              <Image
                src="/icons/shopping-bag.svg"
                alt="bag"
                width={20}
                height={20}
              />
            </button>
          </div>

          {/* Desktop icons */}
          <div className="hidden md:flex items-center gap-2">
            {icons.map((src, idx) => (
              <button
                key={idx}
                aria-label="icon"
                className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer"
              >
                <Image src={src} alt={`icon-${idx}`} width={16} height={16} />
              </button>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Catalog dropdown */}
      {isCatalogOpen && (
        <CatalogDropdown
          isOpen={isCatalogOpen}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />
      )}

      {/* Mobile menu overlay: rendered only when open, positioned between header and appbar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            // fixed so it sits above content but below header/appbar visually
            style={{
              top: HEADER_HEIGHT_PX,
              bottom: APPBAR_HEIGHT_PX,
            }}
            className="fixed left-0 right-0 z-40 bg-white flex flex-col justify-between overflow-hidden"
          >
            {/* Scrollable list */}
            <div className="overflow-y-auto py-2">
              {mobileMenuItems.map(({ title, icon, href }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3"
                >
                  <Image src={icon} alt={title} width={20} height={20} />
                  <span className="text-[14px] font-[400] text-gray-900">
                    {title}
                  </span>
                </Link>
              ))}

              {/* Language Switcher button */}
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

            {/* Bottom block: socials + copyright; pinned to bottom */}
            <div className="absolute left-0 right-0 bottom-[24px] flex flex-col items-center">
              <div className="flex items-center gap-6 justify-center mb-8">
                {socialIcons.map(({ src, alt, href }) => (
                  <Link
                    key={alt}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Image src={src} alt={alt} width={20} height={20} />
                  </Link>
                ))}
              </div>

              <p className="text-lg font-[300] uppercase text-gray-500 text-center">
                © 2025. Carato Jewellery Official
              </p>
            </div>
          </motion.div>
        )}
        <MobileLanguageModal
          open={langModalOpen}
          onClose={() => setLangModalOpen(false)}
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
        />
      </AnimatePresence>
    </header>
  );
}
