// src/features/banner/hooks/useBanners.ts
"use client";

import { useEffect, useState } from "react";
import { getBanners, Banner } from "../services/bannerApi";
import { useLocale } from "next-intl";

export function useBanners() {
  const locale = useLocale() ?? "ru";
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBanners(locale);
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [locale]);

  return { banners, isLoading };
}
