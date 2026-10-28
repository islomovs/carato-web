"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const GRID_IMAGES = [
  "/images/p-5.jpg",
  "/images/p-6.jpg",
  "/images/p-7.jpg",
  "/images/p-8.jpg",
];

// Paths from the content handoff (01_content/links.json)
const CATALOG_PATH = "/products/yuvelirnye-izdeliya";
const PARTNERS_PATH = "/partners";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    // whitespace-pre-line: titles contain intentional "\n" line breaks
    <h2 className="whitespace-pre-line text-[20px] leading-[28px] md:text-[22px] md:leading-[30px] font-medium text-black">
      {children}
    </h2>
  );
}

function SectionText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[16px] leading-[22px] md:text-[18px] md:leading-[26px] font-light text-black">
      {children}
    </p>
  );
}

const CTA_PRIMARY =
  "inline-flex items-center justify-center min-h-[48px] px-6 bg-black text-white border border-black hover:bg-white hover:text-black font-normal uppercase rounded-md text-sm transition-colors";
const CTA_SECONDARY =
  "inline-flex items-center justify-center min-h-[48px] px-6 bg-white text-black border border-black hover:bg-black hover:text-white font-normal uppercase rounded-md text-sm transition-colors";

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();

  return (
    <div className="w-full">
      {/* ─── Hero — full-bleed under the transparent fixed header ─── */}
      {/* -mt-[66px] on desktop pulls the block up so it starts at y=0 behind the header */}
      <div className="relative w-full h-[300px] md:h-[520px] md:-mt-[66px]">
        <Image
          src="/images/about-portrait.jpg"
          alt={t("imageAlt")}
          fill
          // focus on face + earring so the earring is never cropped
          className="object-cover object-[50%_38%]"
          priority
        />
        {/* top gradient keeps transparent-header elements readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-transparent" />
      </div>

      {/* ─── Main content — max 910 px centred, 16 px side padding on mobile ─── */}
      <div className="mx-auto max-w-[910px] px-4 md:px-0">

        {/* Intro */}
        <div className="mt-12 md:mt-20">
          <p className="text-[13px] tracking-[0.12em] uppercase text-[#697586] mb-2">
            {t("eyebrow")}
          </p>
          <SectionTitle>{t("headline")}</SectionTitle>
          <div className="mt-2">
            <SectionText>{t("intro")}</SectionText>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href={`/${locale}${CATALOG_PATH}`} className={CTA_PRIMARY}>
              {t("catalogCta")}
            </Link>
            <Link href={`/${locale}${PARTNERS_PATH}`} className={CTA_SECONDARY}>
              {t("partnerCta")}
            </Link>
          </div>
        </div>

        {/* 2-image row */}
        <div className="mt-12 md:mt-20 flex gap-[10px] md:gap-5 h-[400px] md:h-[295px]">
          <div className="relative flex-1 overflow-hidden">
            <Image src="/images/p-1.jpg" alt="" fill className="object-cover" />
          </div>
          <div className="relative flex-1 overflow-hidden">
            <Image src="/images/p-2.jpg" alt="" fill className="object-cover" />
          </div>
        </div>

        {/* Story */}
        <div className="mt-12 md:mt-20">
          <SectionTitle>{t("storyTitle")}</SectionTitle>
          <div className="mt-2">
            <SectionText>{t("story")}</SectionText>
          </div>
        </div>

        {/* Full-width macro image (386 px desktop / 400 px mobile, 16 px padded) */}
        <figure className="mt-12 md:mt-20">
          <div className="relative w-full h-[400px] md:h-[386px] overflow-hidden">
            <Image
              src="/images/about-detail.jpg"
              alt={t("macroAlt")}
              fill
              // keep the earring centred in both wide and tall crops
              className="object-cover object-[53%_42%]"
            />
          </div>
          <figcaption className="mt-2 text-[14px] font-light text-[#697586]">
            {t("caption")}
          </figcaption>
        </figure>

        {/* Selection */}
        <div className="mt-12 md:mt-20">
          <SectionTitle>{t("selectionTitle")}</SectionTitle>
          <div className="mt-2">
            <SectionText>{t("selection")}</SectionText>
          </div>
        </div>

      </div>

      {/* ─── Details — product image left (429×640 desktop) + text right ─── */}
      <div className="mx-auto max-w-[910px] px-4 md:px-0 mt-12 md:mt-20">
        <div className="flex flex-col md:flex-row md:gap-[52px]">

          {/* Catalogue shot — shown whole (contain), never cropped */}
          <div className="relative w-full md:w-[429px] md:shrink-0 h-[400px] md:h-[640px] overflow-hidden bg-white">
            <Image
              src="/images/about-product.jpg"
              alt={t("productAlt")}
              fill
              className="object-contain"
            />
          </div>

          <div className="mt-12 md:mt-0 md:flex-1 md:flex md:items-center">
            <div>
              <SectionTitle>{t("detailsTitle")}</SectionTitle>
              <div className="mt-2">
                <SectionText>{t("details")}</SectionText>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Partners ─── */}
      <div className="mx-auto max-w-[910px] px-4 md:px-0">
        <div className="mt-12 md:mt-20">
          <SectionTitle>{t("partnerTitle")}</SectionTitle>
          <div className="mt-2">
            <SectionText>{t("partnerText")}</SectionText>
          </div>
          <div className="mt-6">
            <Link href={`/${locale}${PARTNERS_PATH}`} className={CTA_SECONDARY}>
              {t("partnerCta")}
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 4-image 2×2 grid ─── */}
      {/* No px-4 on mobile (goes edge-to-edge), 910 px centred on desktop */}
      <div className="mx-auto max-w-[910px] mt-12 md:mt-20">
        <div className="grid grid-cols-2 gap-[10px] md:gap-5">
          {GRID_IMAGES.map((src) => (
            <div
              key={src}
              className="relative h-[200px] md:h-[440px] overflow-hidden"
            >
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* bottom spacing 160 px desktop / ~80 px mobile */}
      <div className="h-20 md:h-40" />
    </div>
  );
}
