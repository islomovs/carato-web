"use client";

import Image from "next/image";
import Link from "next/link";
import { NavButton } from "../ui/nav-button";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("home.header");
  const socialIcons = [
    { src: "/icons/telegram.svg", alt: "Telegram", href: "#" },
    { src: "/icons/facebook.svg", alt: "Facebook", href: "#" },
    { src: "/icons/instagram.svg", alt: "Instagram", href: "#" },
    { src: "/icons/youtube.svg", alt: "YouTube", href: "#" },
  ];

  return (
    <footer className="hidden md:block w-full bg-white pt-10">
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute left-[32px] flex items-center gap-[24px]">
          {[
            { title: "news", href: "/news" },
            { title: "forPartners", href: "/partners" },
            { title: "qna", href: "/q-and-a" },
          ].map(({ title, href }) => (
            <Link href={href} key={title}>
              <NavButton className="text-[14px] font-[400] text-black mx-[12px]">
                {t(title)}
              </NavButton>
            </Link>
          ))}
        </div>

        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/images/logo.png"
            alt="Carato"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>

        <div className="absolute right-[32px] flex items-center gap-[8px]">
          <div className="flex items-center gap-[6px]">
            <Image src="/icons/phone.svg" alt="phone" width={16} height={16} />
            <span className="text-[12px] font-[400] text-black">
              +998 (90) 123-45-67
            </span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-6 ml-[8px]">
            {socialIcons.map(({ src, alt, href }) => (
              <Link key={alt} href={href}>
                <Image src={src} alt={alt} width={20} height={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center uppercase text-[#9AA4B2] text-[12px] font-[300] py-[24px] mt-[32px]">
        © 2025. Carato Jewellery Official
      </div>
    </footer>
  );
}
