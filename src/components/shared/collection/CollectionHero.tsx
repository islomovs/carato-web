"use client";

import Image from "next/image";

interface CollectionHeroProps {
  title?: string | null;
  description?: string | null;
  mobileImage?: string | null;
  desktopImage?: string | null;
  loading?: boolean;
}

export default function CollectionHero({
  title,
  description,
  mobileImage,
  desktopImage,
  loading,
}: CollectionHeroProps) {
  if (loading) {
    return (
      <>
        {/* Mobile skeleton */}
        <div className="md:hidden w-full h-[300px] bg-gray-200 animate-pulse" />
        {/* Desktop skeleton */}
        <div className="hidden md:block w-full h-[420px] bg-gray-200 animate-pulse" />
      </>
    );
  }

  return (
    <>
      {/* ── Mobile hero ─────────────────────────────────────────── */}
      <div className="md:hidden relative w-full h-[300px] overflow-hidden">
        {mobileImage && (
          <Image
            src={mobileImage}
            alt={title ?? "Collection"}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0000004D]" />

        {/* Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center gap-2">
          {title && (
            <h1
              style={{ fontWeight: 500, fontSize: 20, lineHeight: "28px" }}
              className="text-white"
            >
              {title}
            </h1>
          )}
          {description && (
            <p
              style={{ fontWeight: 300, fontSize: 16, lineHeight: "22px", marginTop: 8 }}
              className="text-white"
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* ── Desktop hero ─────────────────────────────────────────── */}
      <div className="hidden md:block relative w-full h-[420px] overflow-hidden mb-8">
        {desktopImage && (
          <Image
            src={desktopImage}
            alt={title ?? "Collection"}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0000004D]" />

        {/* Text centred, max-width 530 */}
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <div className="max-w-[530px] text-center text-white">
            {title && (
              <h1
                style={{ fontWeight: 500, fontSize: 22, lineHeight: "30px" }}
              >
                {title}
              </h1>
            )}
            {description && (
              <p
                style={{
                  fontWeight: 300,
                  fontSize: 18,
                  lineHeight: "26px",
                  marginTop: 8,
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
