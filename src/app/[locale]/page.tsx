import { useTranslations } from "next-intl";
import BannerCarousel from "@/components/layout/BannerCarousel";

export default function Home() {
  const t = useTranslations("home");
  return (
    <div className="w-full h-full text-center">
      <BannerCarousel />
      <div className="p-10 mt-10">{t("welcome")}</div>
    </div>
  );
}
