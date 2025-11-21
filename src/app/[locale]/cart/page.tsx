"use client";

import { useState, useEffect } from "react";
import ProductsBlock from "../../../components/layout/ProductsBlock";
import { EmptyCart } from "@/components/shared/EmptyCart";
import { CartItem } from "@/components/shared/CartItem";
import { TotalsColumn } from "@/components/shared/TotalsColumn";
import Image from "next/image";
import CheckoutLayer from "@/components/layout/CheckoutLayer";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import useLockScroll from "@/hooks/useLockScroll";

const sampleProducts = [
  {
    id: 1,
    title: "Детский рюкзак с героями мультфильмов",
    price: 125_000,
    oldPrice: 150_000,
    image: "/images/collection-placeholder.webp",
    tags: ["рюкзак", "детский"],
  },
  {
    id: 2,
    title: "Набор игрушек для развития моторики",
    price: 75_000,
    oldPrice: 95_000,
    image: "/images/collection-placeholder.webp",
    tags: ["развивающий", "игрушка"],
  },
  {
    id: 3,
    title: "Детские наушники с микрофоном",
    price: 180_000,
    oldPrice: 200_000,
    image: "/images/product-placeholder.png",
    tags: ["наушники", "детские"],
  },
  {
    id: 4,
    title: "Конструктор магнитный 100 деталей",
    price: 220_000,
    oldPrice: 250_000,
    image: "/images/collection-placeholder.webp",
    tags: ["конструктор", "развивающий"],
  },
  {
    id: 5,
    title: "Детский спортивный костюм",
    price: 300_000,
    oldPrice: 350_000,
    image: "/images/news-placeholder.png",
    tags: ["одежда", "детская"],
  },
  {
    id: 6,
    title: "Мягкая игрушка «Медвежонок»",
    price: 65_000,
    oldPrice: 80_000,
    image: "/images/jewellery-rings.jpg",
    tags: ["игрушка", "мягкая"],
  },
];

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

const initialCartItems: CartItemType[] = [
  {
    id: 1,
    title: "Браслет с черно-синим кристалом, 18к золота",
    size: "M",
    quantity: 2,
    price: 242542325,
    oldPrice: 485084650,
    deliveryDate: "20 - 23 сентября",
    image: "/images/news-placeholder.png",
    isWishlist: false,
  },
  {
    id: 2,
    title: "Ожерелье с подвеской в виде звезды, серебро 925",
    size: "L",
    quantity: 1,
    price: 153153153,
    oldPrice: 306306306,
    deliveryDate: "22 - 25 сентября",
    image: "/images/category-placeholder.png",
    isWishlist: true,
  },
  {
    id: 3,
    title: "Кольцо с изумрудом и бриллиантами, белое золото 14к",
    size: "XL",
    quantity: 1,
    price: 312312312,
    oldPrice: 624624624,
    deliveryDate: "25 - 28 сентября",
    image: "/images/banner-placeholder.jpg",
    isWishlist: false,
  },
  {
    id: 4,
    title:
      "Серьги с рубинами и сапфирами, розовое золото 18к Серьги с рубинами и сапфирами, розовое золото 18к",
    size: "M",
    quantity: 1,
    price: 121121121,
    oldPrice: 242242242,
    deliveryDate: "18 - 21 сентября",
    image: "/images/news-crafted-eternity.jpg",
    isWishlist: false,
  },
  {
    id: 5,
    title: "Часы с кожаным ремешком и золотым корпусом",
    size: "L",
    quantity: 1,
    price: 423423423,
    oldPrice: 846846846,
    deliveryDate: "30 сентября - 3 октября",
    image: "/images/product-placeholder.png",
    isWishlist: true,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>(initialCartItems);
  const [openCheckout, setOpenCheckout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (openCheckout) {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }
  }, [openCheckout]);

  const incrementQty = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQty = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const toggleWishlist = (id: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isWishlist: !item.isWishlist } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalOldPrice = cartItems.reduce(
    (acc, item) => acc + (item.oldPrice || 0) * item.quantity,
    0
  );

  const savings = totalOldPrice - totalPrice;

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  const isEmpty = cartItems.length === 0;

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
                Корзина {cartItems.length > 0 ? `(${cartItems.length})` : ""}
              </h1>

              <div className="flex-1">
                {cartItems.length === 0 && <EmptyCart />}
              </div>

              <div
                className={`flex flex-col gap-8 ${isEmpty ? "mt-0" : "mt-8"} md:mt-0`}
              >
                {/* Cart items */}
                {cartItems.length > 0 &&
                  cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onIncrement={() => incrementQty(item.id)}
                      onDecrement={() => decrementQty(item.id)}
                      onRemove={() => removeItem(item.id)}
                      onToggleWishlist={() => toggleWishlist(item.id)}
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

        {cartItems.length > 0 && (
          <ProductsBlock
            title="Рекомендуем"
            products={sampleProducts}
            hideSeeAll
          />
        )}
      </div>

      {!isDesktop && (
        <CheckoutLayer
          open={openCheckout}
          onClose={() => setOpenCheckout(false)}
          totalPrice={totalPrice}
          fullPage={true}
          onSubmit={(payload) => {
            // handle checkout payload (send to API / redirect)
            console.log("checkout", payload);
            setOpenCheckout(false);
          }}
        />
      )}
    </>
  );
}
