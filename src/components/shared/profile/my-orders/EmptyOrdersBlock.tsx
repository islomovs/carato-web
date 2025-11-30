import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function EmptyOrdersBlock() {
  const t = useTranslations("profile");

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-430px)]">
      <Image
        src="/icons/receipt.svg"
        alt="Empty orders"
        width={80}
        height={80}
        className="text-[#CDD5DF]"
      />
      <p className="mt-3 text-xl font-medium">{t("emptyMessage")}</p>
      <p className="mt-3 text-sm font-normal">
        {t("emptyDescription")
          .split("\n")
          .map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
      </p>
      <Button
        variant="default"
        className="hover:bg-white hover:text-black border border-black mt-9 uppercase text-sm font-normal py-2 px-3 rounded-md cursor-pointer"
      >
        {t("goToCatalog")}
      </Button>
    </div>
  );
}
