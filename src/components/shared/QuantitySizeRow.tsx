import Image from "next/image";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

type QuantitySizeRowProps = {
  quantity: number;
  size: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onToggleWishlist: () => void;
};

export function QuantitySizeRow({
  quantity,
  size,
  onIncrement,
  onDecrement,
  onRemove,
  onToggleWishlist,
}: QuantitySizeRowProps) {
  return (
    <div className="flex items-end gap-4">
      {/* Quantity */}
      <div className="flex-1 md:flex-none flex flex-col gap-2">
        <label className="text-[12px] font-normal text-[#697586] hidden md:flex items-center">
          Количество<span className="ml-[2px] text-[#F24835]">*</span>
        </label>
        <div className="flex justify-between items-center border border-black px-3 py-2 w-full md:w-32 h-11 rounded-md">
          <button
            onClick={onDecrement}
            disabled={quantity <= 1}
            className="disabled:opacity-30 disabled:cursor-not-allowed"
          >
            -
          </button>

          <span className="mx-2 text-sm font-medium">{quantity}</span>

          <button
            onClick={onIncrement}
            disabled={quantity >= 5}
            className="disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Size */}
      <div className="flex-1 md:flex-none flex flex-col gap-2">
        <label className="text-xs font-normal text-[#697586] hidden md:flex items-center">
          Размер <span className="ml-[2px] text-[#F24835]">*</span>
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between border border-black px-3 py-2 w-full md:w-32 h-11 rounded-md cursor-pointer">
            <span className="text-sm font-medium">{size}</span>
            <ChevronDown className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>M</DropdownMenuItem>
            <DropdownMenuItem>L</DropdownMenuItem>
            <DropdownMenuItem>XL</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Trash */}
      <button
        onClick={onRemove}
        className="hidden md:flex items-center justify-center w-11 h-11 bg-[#EEF2F6] hover:bg-[#D1D5DB] transition duration-300 rounded-sm cursor-pointer"
      >
        <Image src="/icons/trash.svg" alt="Trash" width={20} height={20} />
      </button>

      <button
        onClick={onToggleWishlist}
        className="hidden md:flex items-center justify-center w-11 h-11 bg-[#EEF2F6] hover:bg-[#D1D5DB] transition duration-300 rounded-sm cursor-pointer"
      >
        <Image src="/icons/heart.svg" alt="Wishlist" width={20} height={20} />
      </button>
    </div>
  );
}
