/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "../../ui/input";
import { useController, Control } from "react-hook-form";

interface PromocodeFieldProps {
  control?: Control<any>;
  name: string;
  isDesktopColumn?: boolean;
}

export default function PromocodeField({
  control,
  name,
  isDesktopColumn = false,
}: PromocodeFieldProps) {
  const { field } = useController({
    control,
    name,
  });

  return (
    <div
      className={`${isDesktopColumn ? "md:block hidden" : "md:hidden mb-10 border-y border-[#EEF2F6]"} py-6`}
    >
      <div className="relative">
        <Input
          type="text"
          {...field}
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
