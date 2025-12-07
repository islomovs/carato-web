import { Button } from "@/components/ui/button";

interface Props {
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
}: Props) {
  return (
    <div className="border-t border-[#EEF2F6] w-full flex items-center gap-4 px-4 py-4 md:px-10 md:py-6 md:justify-end">
      {hasFilters && (
        <Button
          variant="link"
          onClick={onClear}
          className="underline md:no-underline hover:underline uppercase cursor-pointer text-sm font-normal text-gray-700 w-auto px-0 md:px-4 shrink-0"
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Сбросить всё"}
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
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
              Загрузка...
            </div>
          ) : total > 0 ? (
            `ПОКАЗАТЬ ${total.toLocaleString()} ТОВАРОВ`
          ) : (
            "НЕТ РЕЗУЛЬТАТОВ"
          )}
        </Button>
      </div>
    </div>
  );
}
