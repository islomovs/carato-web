import { Input } from "../ui/input";

interface PromocodeFieldProps {
  promo: string;
  setPromo: (value: string) => void;
  isDesktopColumn?: boolean;
}

export default function PromocodeField({
  promo,
  setPromo,
  isDesktopColumn = false,
}: PromocodeFieldProps) {
  return (
    <div
      className={`${isDesktopColumn ? "md:block hidden" : "md:hidden mb-10 border-y border-[#EEF2F6]"} py-6`}
    >
      <div className="relative">
        <Input
          type="text"
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          placeholder="Промокод"
          className="w-full border-b border-black py-3 pr-28 text-sm bg-white"
        />
        <button
          onClick={() => {
            /* apply promo handling */
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#EEF2F6] rounded-md px-3 py-[5px] text-[12px] font-medium cursor-pointer"
        >
          ПРИМЕНИТЬ
        </button>
      </div>
    </div>
  );
}
