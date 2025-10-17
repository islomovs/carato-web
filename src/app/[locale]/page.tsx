import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");
  return <div className="w-full h-full text-center p-10">{t("welcome")}</div>;
}
