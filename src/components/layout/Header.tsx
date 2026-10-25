"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import CatalogDropdown from "../shared/catalog/CatalogDropdown";
import CollectionsDropdown from "../shared/catalog/CollectionsDropdown";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import MobileLanguageModal from "../shared/MobileLanguageModal";
import AuthModal from "../shared/auth-modal/index";
import DesktopNav from "../shared/DesktopNav";
import MobileMenu from "../shared/MobileMenu";
import HeaderIcons from "../shared/HeaderIcons";
import { useIsAuthenticated } from "@/lib/authStore";
import { useRouter, usePathname } from "next/navigation";
import SearchOverlay from "../shared/SearchOverlay";

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations("home.header");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const currentLang = useLocale();
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdowns when navigating to another page
  useEffect(() => {
    setIsCatalogOpen(false);
    setIsCollectionsOpen(false);
  }, [pathname]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => {
      const progress = Math.min(window.scrollY / 100, 1);
      setScrollProgress(progress);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const handleOpenSearch = () => {
    setIsCatalogOpen(false);
    setIsCollectionsOpen(false);
    setSearchOpen(true);
  };

  // Lock scroll + compensate header for any open dropdown/overlay
  const anyDropdownOpen = isCatalogOpen || isCollectionsOpen;

  useEffect(() => {
    if (anyDropdownOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.documentElement.style.setProperty(
          "--removed-body-scroll-bar-size",
          `${scrollbarWidth}px`
        );
      }
      return () => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        document.documentElement.style.removeProperty(
          "--removed-body-scroll-bar-size"
        );
      };
    }
  }, [anyDropdownOpen]);

  useEffect(() => {
    const shouldLock = menuOpen || searchOpen;
    if (shouldLock) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [menuOpen, searchOpen]);

  const HEADER_HEIGHT_PX = 65;
  const APPBAR_HEIGHT_PX = 52;

  return (
    <header
      className="fixed top-0 left-0 w-full flex justify-center px-2 md:px-8 z-50"
      style={
        transparent && !menuOpen
          ? {
              backgroundColor: `rgba(255, 255, 255, ${scrollProgress})`,
              borderBottom: `1px solid rgba(238, 242, 246, ${scrollProgress})`,
            }
          : { backgroundColor: "rgb(255,255,255)", borderBottom: "1px solid #EEF2F6" }
      }
    >
      <AuthModal initialMode="phone" />
      <div className="container relative flex items-center justify-between py-[14px] md:py-2">
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

        {/* Desktop nav: shops, about, catalog, collections */}
        <DesktopNav
          t={t}
          isCatalogOpen={isCatalogOpen}
          setIsCatalogOpen={setIsCatalogOpen}
          isCollectionsOpen={isCollectionsOpen}
          setIsCollectionsOpen={setIsCollectionsOpen}
        />

        {/* Main logo */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-[48px] items-center"
        >
          <Image
            src="/images/logo.png"
            alt="Carato"
            width={172}
            height={48}
            className="object-contain"
          />
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer"
              onClick={handleOpenSearch}
            >
              <Image
                src="/icons/search.svg"
                alt="search"
                width={20}
                height={20}
              />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer"
              onClick={() =>
                isAuthenticated
                  ? router.push(`/${currentLang}/profile`)
                  : router.push(`/${currentLang}/auth`)
              }
            >
              <Image src="/icons/user.svg" alt="user" width={20} height={20} />
            </button>
          </div>

          {/* Desktop: search, cart, wishlist, profile, language */}
          <HeaderIcons setSearchOpen={handleOpenSearch} />
          {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
        </div>
      </div>

      {/* Catalog dropdown */}
      {isCatalogOpen && (
        <CatalogDropdown
          isOpen={isCatalogOpen}
          setIsCatalogOpen={setIsCatalogOpen}
        />
      )}

      {/* Collections dropdown */}
      <CollectionsDropdown
        isOpen={isCollectionsOpen}
        onClose={() => setIsCollectionsOpen(false)}
      />

      {/* Backdrop for dropdowns — closes on outside click */}
      {anyDropdownOpen && (
        <div
          className="fixed inset-0 top-[65px] bg-[#00000040] z-40"
          onClick={() => {
            setIsCatalogOpen(false);
            setIsCollectionsOpen(false);
          }}
        />
      )}

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            key="mobile-menu"
            currentLang={currentLang}
            setLangModalOpen={setLangModalOpen}
            closeMenu={() => setMenuOpen(false)}
            HEADER_HEIGHT_PX={HEADER_HEIGHT_PX}
            APPBAR_HEIGHT_PX={APPBAR_HEIGHT_PX}
          />
        )}
      </AnimatePresence>

      {/* MobileLanguageModal uses Radix Dialog internally — keep outside AnimatePresence to avoid duplicate-key conflict */}
      <MobileLanguageModal
        open={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        currentLang={currentLang}
        setCurrentLang={() => {}}
      />
    </header>
  );
}
