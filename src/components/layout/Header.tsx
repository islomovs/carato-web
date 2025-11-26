"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import CatalogDropdown from "./CatalogDropdown";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import MobileLanguageModal from "../shared/MobileLanguageModal";
import AuthModal from "../shared/auth-modal/index";
import { usePathname } from "next/navigation";
import DesktopNav from "../shared/DesktopNav";
import MobileMenu from "../shared/MobileMenu";
import HeaderIcons from "../shared/HeaderIcons";

export default function Header() {
  const t = useTranslations("home.header");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("skincare");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("uz");
  const [authOpen, setAuthOpen] = useState(false);

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

  const pathname = usePathname();
  const locale =
    typeof window !== "undefined"
      ? localStorage.getItem("locale") || "ru"
      : "ru";

  const hiddenHeaderPaths = [`/${locale}/product`, `/${locale}/cart`];
  const shouldHideHeader = hiddenHeaderPaths.some((path) =>
    pathname.startsWith(path)
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const HEADER_HEIGHT_PX = 64;
  const APPBAR_HEIGHT_PX = 64;

  const shouldShowHeader = !isMobile || !shouldHideHeader;

  return (
    shouldShowHeader && (
      <header className="fixed top-0 left-0 w-full flex justify-center border-b border-[#EEF2F6] bg-white px-2 md:px-8 z-50">
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
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

          <DesktopNav
            t={t}
            isCatalogOpen={isCatalogOpen}
            setIsCatalogOpen={setIsCatalogOpen}
          />

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
            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer">
                <Image
                  src="/icons/search.svg"
                  alt="search"
                  width={20}
                  height={20}
                />
              </button>
              <Link
                href="/auth"
                className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer"
              >
                <Image
                  src="/icons/user.svg"
                  alt="user"
                  width={20}
                  height={20}
                />
              </Link>
            </div>

            <HeaderIcons setAuthOpen={setAuthOpen} />
          </div>
        </div>

        {isCatalogOpen && (
          <CatalogDropdown
            isOpen={isCatalogOpen}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        )}

        <AnimatePresence>
          {menuOpen && (
            <MobileMenu
              items={mobileMenuItems}
              socialIcons={socialIcons}
              currentLang={currentLang}
              setLangModalOpen={setLangModalOpen}
              closeMenu={() => setMenuOpen(false)}
              HEADER_HEIGHT_PX={HEADER_HEIGHT_PX}
              APPBAR_HEIGHT_PX={APPBAR_HEIGHT_PX}
            />
          )}
          <MobileLanguageModal
            open={langModalOpen}
            onClose={() => setLangModalOpen(false)}
            currentLang={currentLang}
            setCurrentLang={setCurrentLang}
          />
        </AnimatePresence>
      </header>
    )
  );
}
