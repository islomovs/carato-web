/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import ProductSizeSelector from "./ProductSizeSelector";
import { Button } from "../../ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import ShareDropdown from "../auth-modal/ShareDropdown";
import AuthModal from "../auth-modal/index";
import { Product } from "@/services/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/lib/cartStore";
import { toast } from "sonner";
import { getTokenPair } from "@/lib/axios/instance";
import NotifySizeModal from "../checkout/NotifySizeModal";
import DetermineSizeModal from "../checkout/DetermineSizeModal";
import { useWishlistStore } from "@/lib/wishlistStore";
import { WishlistItem } from "@/services/wishlist";
import { useLocale } from "next-intl";
import { useAuthModalStore } from "@/lib/authModalStore";

interface ProductInfoProps {
  product: Product | WishlistItem;
  isLoading?: boolean;
}

export default function ProductInfo({ product, isLoading }: ProductInfoProps) {
  const t = useTranslations("product");

  const stableProduct = useMemo(() => product as Product, [product]);
  const locale = useLocale();

  const [openNotify, setOpenNotify] = useState(false);
  const [openDetermine, setOpenDetermine] = useState(false);
  const { openAuth } = useAuthModalStore();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const addToCart = useCartStore((state) => state.addToCart);

  const isAuthenticated = Boolean(getTokenPair().token);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      openAuth();
      return;
    }

    if (!selectedVariant) {
      toast.error(t("selectSize"));
      return;
    }

    try {
      await addToCart(product!.slug, selectedVariant.size.id!, 1);
      toast.success(t("addedToCartSuccess"));
    } catch {
      toast.error(t("addedToCartError"));
    }
  };

  // Note: useLockScroll is NOT needed here — Radix UI's Dialog already handles
  // scroll locking with proper scrollbar-width compensation internally.
  // Adding it on top causes a double-lock and visual layout shift.

  const { add, remove, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.slug);

  if (isLoading || !product) {
    return (
      <div className="flex flex-col gap-8 w-full pb-[10px] animate-in fade-in">
        {/* Skeleton placeholders */}
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-72" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-10" />
        </div>
        <Skeleton className="h-14 w-full rounded-md" />
        <div className="hidden md:flex flex-col gap-3">
          <Skeleton className="h-[52px] w-full rounded-md" />
          <Skeleton className="h-[52px] w-[52px] rounded-md" />
          <Skeleton className="h-[52px] w-full rounded-md" />
        </div>
      </div>
    );
  }

  const totalStars = 5;
  const rating = (stableProduct as any)?.averageRating || 5;

  console.log(
    "ProductInfo render with product:",
    selectedVariant?.price ?? product.price,
  );

  return (
    <>
      <div className="flex flex-col gap-8 w-full pb-[10px]">
        {/* Category */}
        <div className="flex flex-col justify-start items-start gap-2 w-full">
          <h2 className="font-light text-base text-[#697586]">
            {product?.category?.name}
          </h2>
          <h1 className="font-normal text-[28px] text-start">{product.name}</h1>
          <div className="flex items-center">
            <div className="flex gap-[4px]">
              {Array.from({ length: totalStars }).map((_, index) => {
                const filled = index < rating;
                return (
                  <Star
                    key={index}
                    size={20}
                    className={`${
                      filled
                        ? "fill-[#FAC515] text-[#FAC515]"
                        : "text-[#FAC515]"
                    }`}
                    strokeWidth={filled ? 0 : 1.5}
                  />
                );
              })}
            </div>
            <span className="font-light text-sm underline ml-2">
              {(stableProduct as any)?.reviewsQuantity || 0} {t("reviews")}
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center">
          <span className="font-medium text-2xl">
            {selectedVariant?.price ?? product.price} {t("uzs")}
          </span>
          {(selectedVariant?.discountPrice ?? 0) > 0 && (
            <span className="font-medium text-base text-[#9AA4B2] line-through ml-3">
              {selectedVariant.price} {t("uzs")}
            </span>
          )}
          {(selectedVariant?.discountPercent ?? 0) > 0 && (
            <span className="font-normal text-xs text-[#FEFDF0] bg-[#F04438] py-1 px-2 rounded-[2px] ml-3">
              -{selectedVariant.discountPercent}%
            </span>
          )}
        </div>

        {/* Sizes */}
        <ProductSizeSelector
          variants={stableProduct.variants}
          onOpenNotify={() => setOpenNotify(true)}
          onOpenDetermine={() => setOpenDetermine(true)}
          onSizeSelect={(variant) => setSelectedVariant(variant)}
        />

        {/* Desktop Buttons */}
        <div className="hidden md:flex flex-col gap-3">
          <div className="flex gap-3 w-full">
            <Button
              onClick={handleAddToCart}
              className="bg-black text-white flex-1 h-[52px] text-sm uppercase font-normal rounded-md hover:text-black border border-black hover:bg-white cursor-pointer"
            >
              {t("addToCart")}
            </Button>

            <Button
              variant="ghost"
              className="bg-white text-black w-[52px] h-[52px] font-normal rounded-md border border-black cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuthenticated) {
                  openAuth();
                  return;
                }
                if (inWishlist) {
                  remove(product.slug);
                  toast.success(t("removedFromWishlist"));
                } else {
                  add(product.slug, locale);
                  toast.success(t("addedToWishlist"));
                }
              }}
            >
              <Image
                src={
                  inWishlist ? "/icons/heart-filled.svg" : "/icons/heart.svg"
                }
                alt="Wishlist"
                width={20}
                height={20}
              />
            </Button>

            <ShareDropdown />
          </div>

          <Button
            variant="ghost"
            className="bg-white hover:bg-black text-black hover:text-white w-full h-[52px] font-normal rounded-md border border-black cursor-pointer uppercase"
          >
            {t("buyInOneClick")}
          </Button>
        </div>

        {/* Delivery Block */}
        <div className="flex justify-between items-center w-full bg-[#F8FAFC] p-4">
          <span className="font-normal text-sm text-[#667085]">
            {t("estimatedDeliveryDates")}
          </span>
          <span className="font-normal text-sm">20 - 23 сентября</span>
        </div>

        <NotifySizeModal
          open={openNotify}
          onOpenChange={setOpenNotify}
          productId={stableProduct.id}
          categorySizes={stableProduct.category?.productSizes}
        />
        <DetermineSizeModal
          open={openDetermine}
          onOpenChange={setOpenDetermine}
          categorySizes={stableProduct.category?.productSizes}
          categoryName={stableProduct.category?.name}
          categorySlug={stableProduct.subcategory?.slug ?? stableProduct.category?.slug}
          sizeGuideType={stableProduct.category?.sizeGuideType}
        />

        {/* Auth modal */}
        <AuthModal initialMode="phone" />
      </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 px-4 py-4 flex gap-4 border-t border-[#EEF2F6] bg-white z-50">
        {/* <Button
          variant="outline"
          className="flex-1 h-[52px] uppercase font-[400] text-[14px]"
        >
          Быстрая покупка
        </Button> */}

        <Button
          onClick={handleAddToCart}
          variant="default"
          className="flex-1 h-[52px] uppercase font-[400] text-[14px] bg-black text-white py-[12px] px-4 hover:bg-white hover:text-black border border-black"
        >
          {t("addToCart")}
        </Button>
      </div>
    </>
  );
}
