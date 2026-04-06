"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";

export default function MobileAppBar() {
  const t = useTranslations("appBar");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const navItems = [
    { label: t("home"), href: `/${locale}`, icon: "/icons/home.svg" },
    {
      label: t("catalog"),
      href: `/${locale}/catalog`,
      icon: "/icons/grid.svg",
    },
    {
      label: t("wishlist"),
      href: `/${locale}/wishlist`,
      icon: "/icons/heart.svg",
    },
    {
      label: t("cart"),
      href: `/${locale}/cart`,
      icon: "/icons/shopping-bag.svg",
    },
    {
      label: t("profile"),
      href: `/${locale}/profile`,
      icon: "/icons/user.svg",
    },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  console.log("PATHNAME:", pathname);
  console.log("PATHNAME is matching:", isActive(`/${locale}/catalog`));

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[52px] bg-white border-t border-[#E5E7EB] flex items-center justify-between md:hidden z-50">
      {navItems.map((item) => {
        const active = isActive(item.href);

        return (
          <button
            key={item.label}
            onClick={() => router.push(item.href)}
            className="flex flex-col items-center justify-center flex-1"
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={20}
              height={20}
              className={clsx(
                "transition",
                active ? "brightness-0" : "opacity-50",
              )}
            />

            <span
              className={clsx(
                "text-[12px] font-medium mt-[4px] leading-3",
                active ? "text-black" : "text-[#9AA4B2]",
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
