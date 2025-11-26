"use client";

import { useState, useEffect } from "react";
import ProductsBlock from "../../../components/layout/ProductsBlock";
import { EmptyCart } from "@/components/shared/EmptyCart";
import { CartItem } from "@/components/shared/CartItem";
import { TotalsColumn } from "@/components/shared/TotalsColumn";
import CheckoutLayer from "@/components/layout/CheckoutLayer";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import useLockScroll from "@/hooks/useLockScroll";
import { useCartStore } from "@/lib/cartStore";
import { useTranslations } from "next-intl";
import { CartSkeleton } from "@/components/shared/CartSkeleton";

export default function CartPage() {
  const router = useRouter();
  const [openCheckout, setOpenCheckout] = useState(false);
  const t = useTranslations("cart");

  const {
    cartItems,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    loading,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (openCheckout) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openCheckout]);

  const handleRemove = (slug: string, sizeId: number) => {
    removeItem(slug, sizeId);
  };

  // Total price WITH DISCOUNT applied (if discountPrice exists)
  const totalPrice = cartItems.reduce((acc, item) => {
    const finalPrice = item.product.discountPrice ?? item.product.price;
    return acc + finalPrice * item.quantity;
  }, 0);

  // Total OLD price (WITHOUT discount, always the original price)
  const totalOldPrice = cartItems.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  // Savings
  const savings = totalOldPrice - totalPrice;

  console.log("Cart totals:", {
    totalPrice,
    totalOldPrice,
    savings,
    cartItems,
  });

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const isEmpty = cartItems.length === 0;

  console.log("Cart items:", cartItems);

  return (
    <>
      <div
        className={`flex flex-col ${isEmpty ? "mb-0" : "mb-[152px]"} md:mb-0`}
      >
        <div className="flex flex-col">
          <PageHeader
            title={`Корзина ${cartItems.length ? `(${cartItems.length})` : ""}`}
            onClose={() => router.back()}
            absoluteClose
            className="md:hidden md:px-10 md:pt-10 md:pb-5"
          />
          <div className="flex flex-row px-4 md:px-0 items-start min-h-full">
            {/* Main content */}
            <div
              className={`flex-1 flex flex-col ${isEmpty ? "pb-0" : "md:pb-[68px]"} md:px-8`}
            >
              {/* Desktop title */}
              <h1 className="hidden md:block text-[28px] font-normal mt-[52px] mb-8">
                {t("title")}{" "}
                {cartItems.length > 0 ? `(${cartItems.length})` : ""}
              </h1>

              {loading && <CartSkeleton rows={3} />}

              <div className="flex-1">
                {isEmpty && !loading && <EmptyCart />}
              </div>

              <div
                className={`flex flex-col gap-8 ${isEmpty ? "mt-0" : "mt-8"} md:mt-0`}
              >
                {/* Cart items */}
                {cartItems.map((item) => (
                  <CartItem
                    key={`${item.product.id}-${item.product.variants[0]?.size.id}`}
                    item={item}
                    updateQuantity={(slug, sizeId, quantity) =>
                      updateQuantity(slug, sizeId, quantity)
                    }
                    removeItem={() =>
                      handleRemove(
                        item.product.slug,
                        item.product.variants[0].size.id
                      )
                    }
                    onToggleWishlist={() => {}}
                  />
                ))}
              </div>
            </div>

            {cartItems.length > 0 && (
              <TotalsColumn
                onCheckout={() => {
                  if (window.innerWidth >= 768) {
                    router.push("/checkout");
                  } else {
                    setOpenCheckout(true);
                  }
                }}
                totalPrice={totalPrice}
                savings={savings}
                count={cartItems.length}
              />
            )}
          </div>
        </div>

        {/* {cartItems.length > 0 && (
          <ProductsBlock
            title="Рекомендуем"
            products={}
            hideSeeAll
          />
        )} */}
      </div>

      {!isDesktop && (
        <CheckoutLayer
          open={openCheckout}
          onClose={() => setOpenCheckout(false)}
          totalPrice={totalPrice}
          fullPage={true}
          onSubmit={(payload) => {
            console.log("checkout", payload);
            setOpenCheckout(false);
          }}
        />
      )}
    </>
  );
}
