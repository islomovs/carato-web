import Image from "next/image";
import { QuantitySizeRow } from "./QuantitySizeRow";

type CartItemType = {
  id: number;
  title: string;
  size: string;
  quantity: number;
  price: number;
  oldPrice?: number;
  deliveryDate: string;
  image: string;
  isWishlist: boolean;
};

type CartItemProps = {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onToggleWishlist: () => void;
};

export function CartItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onToggleWishlist,
}: CartItemProps) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-2 text-sm border-b border-black/20 py-2">
        <span className="font-light">Примерные даты доставки</span>
        <span className="font-medium">{item.deliveryDate}</span>
      </div>

      <div className="relative flex flex-col items-start md:flex-row gap-5 md:w-full">
        <div className="flex flex-row gap-5 md:w-full">
          {/* Delete (top-right) */}
          <button
            onClick={onRemove}
            className="absolute top-0 right-0 md:hidden w-5 h-5"
          >
            <Image src="/icons/trash.svg" alt="Trash" width={20} height={20} />
          </button>
          {/* Image */}
          <div className="relative w-20 md:w-[164px] h-20 md:h-[164px] flex items-center justify-center bg-gray-50">
            <Image
              src={item.image}
              alt={item.title}
              width={164}
              height={164}
              className="object-cover w-full h-full"
            />

            {/* Wishlist (top-left) */}
            <button
              onClick={onToggleWishlist}
              className="absolute top-0 left-0 md:hidden w-5 h-5"
            >
              <Image
                src={
                  item.isWishlist
                    ? "/icons/heart-filled.svg"
                    : "/icons/heart.svg"
                }
                alt="Wishlist"
                width={20}
                height={20}
              />
            </button>
          </div>

          {/* Details */}
          <div
            className={`flex-1 flex flex-col gap-4 ${item.quantity === 1 ? "md:justify-between" : "md:gap-6"}`}
          >
            <p className="text-base font-medium mr-7 md:mr-0">{item.title}</p>
            <QuantitySizeRow
              quantity={item.quantity}
              size={item.size}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
              onToggleWishlist={onToggleWishlist}
            />
            <div
              className={`${item.quantity === 1 ? "block" : "hidden"} py-0.5 md:py-1 px-2 bg-[#F79009] text-xs rounded-xs text-white w-fit`}
            >
              Осталась 1 штука
            </div>
            <div className="flex md:hidden flex-col items-start md:items-end">
              <span className="text-base font-medium">
                {item.price.toLocaleString()} UZS
              </span>
              {item.oldPrice && (
                <span className="text-xs font-medium text-[#697586] line-through">
                  {item.oldPrice.toLocaleString()} UZS
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:flex flex-col items-start md:items-start">
            <span className="text-base font-medium">
              {item.price.toLocaleString()} UZS
            </span>
            {item.oldPrice && (
              <span className="text-xs font-medium text-[#697586] line-through">
                {item.oldPrice.toLocaleString()} UZS
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
