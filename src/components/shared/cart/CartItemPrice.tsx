"use client";

import { CartItem } from "@/lib/cartStore";
import React from "react";
import { useTranslations } from "next-intl";

export default function CartItemPrice({
  item,
  isDesktop,
}: {
  item: CartItem;
  isDesktop?: boolean;
}) {
  const t = useTranslations("cart");
  const variant = item.product.variants[0];
  const hasDiscount = !!variant.discountPrice;

  const finalPrice = hasDiscount
    ? variant.discountPrice * item.quantity
    : variant.price * item.quantity;

  const oldPrice = variant.price * item.quantity;

  return (
    <div
      className={`${isDesktop ? "hidden md:flex" : "flex md:hidden"} flex-col items-start`}
    >
      <span className="text-base font-medium">
        {finalPrice.toLocaleString()} {t("uzs")}
      </span>

      {hasDiscount && (
        <span className="text-xs font-medium text-[#697586] line-through">
          {oldPrice.toLocaleString()} {t("uzs")}
        </span>
      )}
    </div>
  );
}
