"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { Search, Handbag, Heart, User } from "lucide-react";
import { NavButton } from "../ui/nav-button";
import CatalogDropdown from "./CatalogDropdown";

export default function Header() {
  const t = useTranslations("home.header");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("skincare");

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

  return (
    <header className="relative w-full border-b border-gray-200 bg-white px-8">
      <div className="container flex h-16 items-center justify-between">
        <nav className="flex items-center gap-6 text-sm h-6">
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

        <Link href="/" className="text-xl font-semibold">
          Carato
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {[Search, Handbag, Heart, User].map((Icon, idx) => (
              <button
                key={idx}
                aria-label="icon"
                className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#EEF2F6] transition-colors cursor-pointer"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {isCatalogOpen && (
        <CatalogDropdown
          isOpen={isCatalogOpen}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </header>
  );
}
