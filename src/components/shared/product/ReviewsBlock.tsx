import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "use-intl";

export default function ReviewsBlock() {
  const t = useTranslations("profile");
  
  return (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[910px]"
    >
      <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-65px)] md:min-h-[calc(100vh-430px)]">
        <Image
          src="/icons/file-check.svg"
          alt="Empty reviews"
          width={80}
          height={80}
          className="text-[#CDD5DF]"
        />
        <p className="mt-3 text-xl font-medium">{t("emptyReviewsMessage")}</p>
        <p className="mt-3 text-sm font-normal">
          {t("emptyReviewsDescription")
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
        </p>
      </div>
    </motion.div>
  );
}
