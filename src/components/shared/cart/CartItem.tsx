"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { QuantitySizeRow } from "../checkout/QuantitySizeRow";
import type { CartItem } from "@/lib/cartStore";
import { useTranslations } from "next-intl";
import { debounce } from "@/lib/debounce";

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
    if (localQty < item.product.stockQuantity) {
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

  // Keep localQty in sync if item.quantity changes from outside (e.g., fetchCart)
  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-2 text-sm border-b border-black/20 py-2">
        <span className="font-light">{t("estimatedDeliveryDates")}</span>
        <span className="font-medium">23 - 26</span>
      </div>

      <div className="relative flex flex-col items-start md:flex-row gap-5 md:w-full">
        <div className="flex flex-row gap-5 md:w-full">
          {/* Delete (top-right) */}
          <button
            onClick={removeItem}
            className="absolute top-0 right-0 md:hidden w-5 h-5"
          >
            <Image src="/icons/trash.svg" alt="Trash" width={20} height={20} />
          </button>
          {/* Image */}
          <div className="relative w-20 md:w-[164px] h-20 md:h-[164px] flex items-center justify-center bg-gray-50">
            <Image
              src={item.product.images[0].image}
              alt={item.product.name}
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
                src={true ? "/icons/heart-filled.svg" : "/icons/heart.svg"}
                alt="Wishlist"
                width={20}
                height={20}
              />
            </button>
          </div>

          {/* Details */}
          <div
            className={`flex-1 flex flex-col gap-4 ${item.product.stockQuantity === 1 ? "md:justify-between" : "md:gap-6"}`}
          >
            <p className="text-base font-medium mr-7 md:mr-0">
              {item.product.name}
            </p>
            <QuantitySizeRow
              isSyncing={syncing}
              quantity={localQty}
              stockQuantity={item.product.stockQuantity}
              size={item.product.variants[0].size.name}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={removeItem}
              onToggleWishlist={onToggleWishlist}
            />
            <div
              className={`${item.product.stockQuantity === 1 ? "block" : "hidden"} py-0.5 md:py-1 px-2 bg-[#F79009] text-xs rounded-xs text-white w-fit`}
            >
              {t("lastOneInStock")}
            </div>
            <div className="flex md:hidden flex-col items-start md:items-end">
              <span className="text-base font-medium">
                {item.product.variants[0].discountPrice
                  ? (
                      item.product.variants[0].discountPrice * item.quantity
                    ).toLocaleString()
                  : (item.product.price * item.quantity).toLocaleString()}{" "}
                {t("uzs")}
              </span>
              {item.product.variants[0].discountPrice && (
                <span className="text-xs font-medium text-[#697586] line-through">
                  {(item.product.price * item.quantity).toLocaleString()}{" "}
                  {t("uzs")}
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:flex flex-col items-start md:items-start">
            <span className="text-base font-medium">
              {item.product.variants[0].discountPrice
                ? (
                    item.product.variants[0].discountPrice * item.quantity
                  ).toLocaleString()
                : (
                    item.product.variants[0].price * item.quantity
                  ).toLocaleString()}{" "}
              {t("uzs")}
            </span>
            {item.product.variants[0].discountPrice && (
              <span className="text-xs font-medium text-[#697586] line-through">
                {(
                  item.product.variants[0].price * item.quantity
                ).toLocaleString()}{" "}
                {t("uzs")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
