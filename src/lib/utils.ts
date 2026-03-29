import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPageWindow(
  totalPages: number,
  current: number,
  maxVisible = 5,
) {
  if (totalPages <= maxVisible) {
    return {
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      leftEllipsis: false,
      rightEllipsis: false,
    };
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(totalPages, current + half);

  if (start === 1) {
    end = Math.min(totalPages, start + maxVisible - 1);
  } else if (end === totalPages) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const leftEllipsis = start > 2;
  const rightEllipsis = end < totalPages - 1;

  return { pages, leftEllipsis, rightEllipsis, start, end };
}

// lib/formatDate.ts
export function formatNewsDate(dateString: string, locale: string): string {
  const localeMap = {
    ru: "ru-RU",
    uz: "uz-Latn-UZ",
    en: "en-US",
  } as const;

  return new Intl.DateTimeFormat(
    localeMap[locale as keyof typeof localeMap] || "ru-RU",
    {
      day: "numeric",
      month: "long",
    },
  ).format(new Date(dateString));
}
