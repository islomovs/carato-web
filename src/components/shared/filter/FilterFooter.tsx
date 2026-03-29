import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

interface FilterFooterProps {
  hasFilters: boolean;
  total: number;
  loading?: boolean;
  onClear: () => void;
  onApply: () => void;
}

export default function FilterFooter({
  hasFilters,
  total,
  loading = false,
  onClear,
  onApply,
}: FilterFooterProps) {
  const t = useTranslations("filters");

  return (
    <div className="border-t border-[#EEF2F6] w-full flex items-center gap-4 px-4 py-4 md:px-10 md:py-6 md:justify-end">
      {hasFilters && (
        <Button
          variant="link"
          onClick={onClear}
          className="underline md:no-underline hover:underline uppercase cursor-pointer text-sm font-normal text-gray-700 w-auto px-0 md:px-4 shrink-0"
          disabled={loading}
        >
          {loading ? t("loading") : t("resetAll")}
        </Button>
      )}
      <div className="flex-1 md:flex-none">
        <Button
          disabled={!Boolean(total) || loading}
          onClick={onApply}
          className={`uppercase cursor-pointer text-sm font-normal p-7 w-full md:w-auto ${
            total === 0 ? "bg-[#CDD5DF]" : ""
          }`}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}

          {loading
            ? t("loading")
            : total > 0
              ? t("showProducts", { total })
              : t("noResults")}
        </Button>
      </div>
    </div>
  );
}
