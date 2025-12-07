"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import CatalogDropdown from "../shared/catalog/CatalogDropdown";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("uz");
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (menuOpen || isCatalogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen, isCatalogOpen]);

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
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          initialMode="phone"
        />
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

          {/* Left size btns: shops, about, catalog */}
          <DesktopNav
            t={t}
            isCatalogOpen={isCatalogOpen}
            setIsCatalogOpen={setIsCatalogOpen}
          />

          {/* Main logo */}
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

            {/* Desktop btns: search, cart, wishlist, profile, language */}
            <HeaderIcons setAuthOpen={setAuthOpen} />
          </div>
        </div>

        {isCatalogOpen && (
          <CatalogDropdown
            isOpen={isCatalogOpen}
            setIsCatalogOpen={setIsCatalogOpen}
          />
        )}

        <AnimatePresence>
          {menuOpen && (
            <MobileMenu
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
