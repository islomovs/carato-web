"use client";

import { useState, useEffect } from "react";
// import ProductsBlock from "../../../components/layout/ProductsBlock";
import { EmptyCart } from "@/components/shared/cart/EmptyCart";
import { CartItem } from "@/components/shared/cart/CartItem";
import { TotalsColumn } from "@/components/shared/checkout/TotalsColumn";
import CheckoutLayer from "@/components/layout/CheckoutLayer";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { useCartStore } from "@/lib/cartStore";
import { useTranslations } from "next-intl";
import { CartSkeleton } from "@/components/shared/cart/CartSkeleton";
import { CartItem as CartItemType } from "@/lib/cartStore";

export default function CartPage() {
  const router = useRouter();
  const [openCheckout, setOpenCheckout] = useState(false);
  const t = useTranslations("cart");

  const {
    fetchCart,
    updateQuantity,
    removeItem,
    loading,
    totalQuantity,
    totalPrice,
    totalOldPrice,
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

  // Savings
  const savings = totalOldPrice() - totalPrice();

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const testCartItems: CartItemType[] = [
    {
      product: {
        id: 1,
        slug: "test-product-1",
        name: "Test Product 1",
        stockQuantity: 10,
        price: 100000,
        discountPrice: 90000,
        discountPercent: 10,
        images: [{ image: "/images/p-1.jpg" }],
        variants: [
          {
            size: { id: 1, name: "M" },
            price: 100000,
            discountPrice: 90000,
            discountPercent: 10,
            stockQuantity: 10,
          },
        ],
      },
      quantity: 2,
    },
    {
      product: {
        id: 2,
        slug: "test-product-2",
        name: "Test Product 2",
        stockQuantity: 1,
        price: 200000,
        images: [{ image: "/images/p-2.jpg" }],
        variants: [
          {
            size: { id: 2, name: "L" },
            price: 200000,
            discountPrice: 0,
            discountPercent: 0,
            stockQuantity: 5,
          },
        ],
      },
      quantity: 1,
    },
    {
      product: {
        id: 3,
        slug: "test-product-3",
        name: "Test Product 3",
        stockQuantity: 8,
        price: 150000,
        discountPrice: 120000,
        discountPercent: 20,
        images: [{ image: "/images/p-3.jpg" }],
        variants: [
          {
            size: { id: 3, name: "S" },
            price: 150000,
            discountPrice: 120000,
            discountPercent: 20,
            stockQuantity: 8,
          },
        ],
      },
      quantity: 3,
    },
    {
      product: {
        id: 4,
        slug: "test-product-4",
        name: "Test Product 4",
        stockQuantity: 12,
        price: 50000,
        images: [{ image: "/images/p-4.jpg" }],
        variants: [
          {
            size: { id: 4, name: "XL" },
            price: 50000,
            discountPrice: 0,
            discountPercent: 0,
            stockQuantity: 12,
          },
        ],
      },
      quantity: 4,
    },
    {
      product: {
        id: 5,
        slug: "test-product-5",
        name: "Test Product 5",
        stockQuantity: 7,
        price: 300000,
        discountPrice: 270000,
        discountPercent: 10,
        images: [{ image: "/images/p-5.jpg" }],
        variants: [
          {
            size: { id: 5, name: "M" },
            price: 300000,
            discountPrice: 270000,
            discountPercent: 10,
            stockQuantity: 7,
          },
        ],
      },
      quantity: 1,
    },
    {
      product: {
        id: 6,
        slug: "test-product-6",
        name: "Test Product 6",
        stockQuantity: 3,
        price: 400000,
        images: [{ image: "/images/p-6.jpg" }],
        variants: [
          {
            size: { id: 6, name: "L" },
            price: 400000,
            discountPrice: 0,
            discountPercent: 0,
            stockQuantity: 3,
          },
        ],
      },
      quantity: 2,
    },
  ];
  const isEmpty = testCartItems.length === 0;

  console.log("Cart items:", testCartItems);

  return (
    <>
      <div
        className={`flex flex-col ${isEmpty ? "mb-0" : "mb-[152px]"} md:mb-0`}
      >
        <div className="flex flex-col">
          <PageHeader
            title={`${t("title")} ${testCartItems.length ? `(${testCartItems.length})` : ""}`}
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
                {testCartItems.length > 0 ? `(${testCartItems.length})` : ""}
              </h1>

              {loading && <CartSkeleton rows={3} />}

              <div className="flex-1">
                {isEmpty && !loading && <EmptyCart />}
              </div>

              <div
                className={`flex flex-col gap-8 ${isEmpty ? "mt-0" : "mt-8 mb-12"} md:mt-0 md:mb-0`}
              >
                {/* Cart items */}
                {testCartItems.map((item) => (
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

            {testCartItems.length > 0 && (
              <TotalsColumn
                totalPrice={totalPrice()}
                savings={savings}
                count={totalQuantity()}
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
          fullPage={true}
        />
      )}
    </>
  );
}
