"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const SPECIALS = [
  ["special1Title", "special1Text"],
  ["special2Title", "special2Text"],
  ["special3Title", "special3Text"],
  ["special4Title", "special4Text"],
  ["special5Title", "special5Text"],
] as const;

const VALUES = [
  ["value1Title", "value1Text"],
  ["value2Title", "value2Text"],
  ["value3Title", "value3Text"],
  ["value4Title", "value4Text"],
] as const;

const BUYERS = ["buyers1", "buyers2", "buyers3", "buyers4"] as const;

const GRID_IMAGES = [
  "/images/p-5.jpg",
  "/images/p-6.jpg",
  "/images/p-7.jpg",
  "/images/p-8.jpg",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[20px] leading-[28px] md:text-[22px] md:leading-[30px] font-medium text-black">
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

function Citation({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#EEF2F6] rounded-[4px] border-l-4 border-[#697586] px-5 md:px-6 py-4 flex flex-col gap-[10px]">
      {children}
    </div>
  );
}

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="w-full">
      {/* ─── Hero — full-bleed under the transparent fixed header ─── */}
      {/* -mt-[66px] on desktop pulls the block up so it starts at y=0 behind the header */}
      <div className="relative w-full h-[300px] md:h-[520px] md:-mt-[66px]">
        <Image
          src="/images/promo1.jpg"
          alt="Carato"
          fill
          className="object-cover"
          priority
        />
        {/* top gradient keeps transparent-header elements readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-transparent" />
      </div>

      {/* ─── Main content — max 910 px centred, 16 px side padding on mobile ─── */}
      <div className="mx-auto max-w-[910px] px-4 md:px-0">

        {/* Кто мы */}
        <div className="mt-12 md:mt-20">
          <SectionTitle>{t("whoTitle")}</SectionTitle>
          <div className="mt-2">
            <SectionText>{t("whoText")}</SectionText>
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

        {/* Наша миссия */}
        <div className="mt-12 md:mt-20">
          <SectionTitle>{t("missionTitle")}</SectionTitle>
          <div className="mt-2">
            <SectionText>{t("missionText")}</SectionText>
          </div>
        </div>

        {/* Что делает нас особенными — citation block */}
        <div className="mt-12 md:mt-20">
          <SectionTitle>{t("specialTitle")}</SectionTitle>
          <div className="mt-2">
            <Citation>
              {SPECIALS.map(([titleKey, textKey]) => (
                <SectionText key={titleKey}>
                  <span className="font-medium">{t(titleKey)}:</span>{" "}
                  {t(textKey)}
                </SectionText>
              ))}
            </Citation>
          </div>
        </div>

        {/* Full-width image (386 px desktop / 400 px mobile, 16 px padded) */}
        <div className="mt-12 md:mt-20 relative w-full h-[400px] md:h-[386px] overflow-hidden">
          <Image
            src="/images/news-golden-harmony.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        {/* История и путь — 2-column text on desktop */}
        <div className="mt-12 md:mt-20">
          <SectionTitle>{t("historyTitle")}</SectionTitle>
          <div className="mt-2 flex flex-col md:flex-row md:gap-[52px]">
            <div className="md:flex-1">
              <SectionText>{t("historyLeft")}</SectionText>
            </div>
            <div className="mt-2 md:mt-0 md:flex-1">
              <SectionText>{t("historyRight")}</SectionText>
            </div>
          </div>
        </div>

      </div>

      {/* ─── Наши ценности — image left (429×640 desktop) + numbered list right ─── */}
      <div className="mx-auto max-w-[910px] px-4 md:px-0 mt-12 md:mt-20">
        <div className="flex flex-col md:flex-row md:gap-[52px]">

          {/* Image — 400 px mobile, 429×640 desktop */}
          <div className="relative w-full md:w-[429px] md:shrink-0 h-[400px] md:h-[640px] overflow-hidden">
            <Image
              src="/images/jewellery-rings.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          {/* Values — stacked on mobile (48 px gap via mt-12), centred vertically on desktop */}
          <div className="mt-12 md:mt-0 md:flex-1 md:flex md:items-center">
            <div>
              <SectionTitle>{t("valuesTitle")}</SectionTitle>
              <ol className="mt-2 flex flex-col gap-[10px]">
                {VALUES.map(([titleKey, textKey], i) => (
                  <li key={titleKey}>
                    <SectionText>
                      <span className="font-medium">
                        {i + 1}.&nbsp;{t(titleKey)}
                      </span>{" "}
                      — {t(textKey)}
                    </SectionText>
                  </li>
                ))}
              </ol>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Для покупателей + Для партнёров ─── */}
      <div className="mx-auto max-w-[910px] px-4 md:px-0">

        {/* Для покупателей */}
        <div className="mt-12 md:mt-20">
          <SectionTitle>{t("buyersTitle")}</SectionTitle>
          <div className="mt-2">
            <SectionText>{t("buyersIntro")}</SectionText>
          </div>
          {/* bullet list — 20 px gap */}
          <div className="mt-5">
            <Citation>
              {BUYERS.map((key) => (
                <SectionText key={key}>{t(key)}</SectionText>
              ))}
            </Citation>
          </div>
          {/* outro — 20 px gap */}
          <div className="mt-5">
            <SectionText>{t("buyersOutro")}</SectionText>
          </div>
        </div>

        {/* Для партнёров */}
        <div className="mt-12 md:mt-20">
          <SectionTitle>{t("partnersTitle")}</SectionTitle>
          <div className="mt-2">
            <SectionText>{t("partnersText")}</SectionText>
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
