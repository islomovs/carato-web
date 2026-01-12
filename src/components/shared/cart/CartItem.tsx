"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { QuantityRow } from "../checkout/QuantityRow";
import type { CartItem } from "@/lib/cartStore";
import { useTranslations } from "next-intl";
import { debounce } from "@/lib/debounce";
import CartItemPrice from "./CartItemPrice";
import CartItemImage from "./CartItemImage";

interface CartItemProps {
  item: CartItem;
  updateQuantity: (slug: string, sizeId: number, quantity: number) => void;
  removeItem: () => void;
  onToggleWishlist: () => void;
}

export function CartItem({
  item,
  updateQuantity,
  removeItem,
  onToggleWishlist,
}: CartItemProps) {
  const t = useTranslations("cart");

  const [localQty, setLocalQty] = useState(item.quantity);
  const [syncing, setSyncing] = useState(false);

  // Debounced API call
  const debouncedRef = useRef<(qty: number) => void>(() => {});
  useEffect(() => {
    debouncedRef.current = debounce((newQty: number) => {
      updateQuantity(
        item.product.slug,
        item.product.variants[0].size.id,
        newQty
      );
      setSyncing(false);
    }, 700);
  }, [item.product.slug, item.product.variants, updateQuantity]);

  const syncQuantity = (newQty: number) => {
    debouncedRef.current(newQty);
  };

  const handleIncrement = () => {
    console.log("Clicked increment");
    console.log("Current localQty:", localQty);
    console.log("Stock quantity:", item.product.variants[0].stockQuantity);
    if (localQty < item.product.variants[0].stockQuantity) {
      const newQty = localQty + 1;
      setLocalQty(newQty);
      setSyncing(true);
      syncQuantity(newQty);
    }
  };

  const handleDecrement = () => {
    if (localQty > 1) {
      const newQty = localQty - 1;
      setLocalQty(newQty);
      setSyncing(true);
      syncQuantity(newQty);
    }
  };

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-2 text-sm border-b border-black/20 py-2">
        <span className="font-light">{t("estimatedDeliveryDates")}</span>
        <span className="font-medium">23 - 26 сентября</span>
      </div>

      <div className="relative flex flex-col items-start md:flex-row gap-5 md:w-full">
        <div className="flex flex-row gap-5 w-full">
          {/* Delete (top-right) */}
          <button
            onClick={removeItem}
            className="absolute top-0 right-0 md:hidden w-5 h-5"
          >
            <Image src="/icons/trash.svg" alt="Trash" width={20} height={20} />
          </button>
          {/* Image */}
          <CartItemImage item={item} onToggleWishlist={onToggleWishlist} />

          {/* Details */}
          <div
            className={`flex-1 flex flex-col justify-between gap-4 md:gap-6 ${item.product.stockQuantity === 1 ? "md:justify-between" : "md:justify-normal"}`}
          >
            <div className="flex flex-col md:gap-2">
              <p className="text-base font-medium mr-7 md:mr-0">
                {item.product.name}
              </p>
              <p className="hidden md:block text-xs text-[#697586] font-normal">
                Размер: {item.product.variants[0].size.name}
              </p>
            </div>
            <p className="block md:hidden text-xs text-[#697586] font-normal">
              Размер: {item.product.variants[0].size.name}
            </p>
            <QuantityRow
              isSyncing={syncing}
              quantity={localQty}
              stockQuantity={item.product.stockQuantity}
              size={item.product.variants[0].size.name}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={removeItem}
              onToggleWishlist={onToggleWishlist}
              item={item}
            />
            <div
              className={`${item.product.stockQuantity === 1 ? "block" : "hidden"} py-0.5 md:py-1 px-2 bg-[#E3E8EF] md:bg-[#F79009] text-xs rounded-xs text-black md:text-white w-fit`}
            >
              {t("lastOneInStock")}
            </div>

            <CartItemPrice item={item} isDesktop={false} />
          </div>
          <CartItemPrice item={item} isDesktop={true} />
        </div>
      </div>
    </div>
  );
}
