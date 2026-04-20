import Link from "next/link";
import { NavButton } from "../ui/nav-button";
import type { Dispatch, SetStateAction } from "react";

type DesktopNavProps = {
  t: (key: string) => string;
  isCatalogOpen: boolean;
  setIsCatalogOpen: Dispatch<SetStateAction<boolean>>;
  isCollectionsOpen: boolean;
  setIsCollectionsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DesktopNav({
  t,
  isCatalogOpen,
  setIsCatalogOpen,
  isCollectionsOpen,
  setIsCollectionsOpen,
}: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center justify-center gap-6 text-sm h-10 mt-2">
      <Link href="/shops">
        <NavButton>{t("shops")}</NavButton>
      </Link>
      <Link href="/about">
        <NavButton>{t("about")}</NavButton>
      </Link>
      <NavButton
        onClick={() => {
          setIsCatalogOpen((prev) => !prev);
          setIsCollectionsOpen(false);
        }}
        active={isCatalogOpen}
      >
        {t("catalog")}
      </NavButton>
      <NavButton
        onClick={() => {
          setIsCollectionsOpen((prev) => !prev);
          setIsCatalogOpen(false);
        }}
        active={isCollectionsOpen}
      >
        {t("collections")}
      </NavButton>
    </nav>
  );
}
