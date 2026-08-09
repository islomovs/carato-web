"use client";

import { CartItem } from "@/lib/cartStore";
import React from "react";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/formatPrice";

export default function CartItemPrice({
  item,
  isDesktop,
}: {
  item: CartItem;
  isDesktop?: boolean;
}) {
  const t = useTranslations("cart");
  const variant = item.product.variants[0];
  const hasDiscount = (variant.discountPercent ?? 0) > 0;

  const unitSalePrice = hasDiscount
    ? Math.round(variant.price * (1 - (variant.discountPercent ?? 0) / 100) * 100) / 100
    : variant.price;

  const finalPrice = unitSalePrice * item.quantity;
  const oldPrice = variant.price * item.quantity;

  return (
    <div
      className={`${isDesktop ? "hidden md:flex" : "flex md:hidden"} flex-col items-start`}
    >
      <span className="text-base font-medium">
        {formatPrice(finalPrice)} {t("uzs")}
      </span>

      {hasDiscount && (
        <span className="text-xs font-medium text-[#697586] line-through">
          {formatPrice(oldPrice)} {t("uzs")}
        </span>
      )}
    </div>
  );
}
