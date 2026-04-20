"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/services/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { WishlistItem } from "@/services/wishlist";
import { useWishlistStore } from "@/lib/wishlistStore";
import { getTokenPair } from "@/lib/axios/instance";
import { useAuthModalStore } from "@/lib/authModalStore";

export function isWishlistItem(
  item: Product | WishlistItem,
): item is WishlistItem {
  return "product" in item;
}

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product | WishlistItem;
  onOpen?: (product: Product | WishlistItem) => void;
}) {
  const productData: Product = isWishlistItem(product)
    ? (product as Product)
    : product;

  const t = useTranslations("product");
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const locale = useLocale();
  const isAuthenticated = Boolean(getTokenPair().token);

  const { add, remove, isInWishlist } = useWishlistStore();
  const { openAuth } = useAuthModalStore();

  const inWishlist = isInWishlist(productData.slug);

  const router = useRouter();

  const handleOpen = (productData: Product | WishlistItem) =>
    onOpen?.(productData);

  const discountedPrice = productData.discountPercent
    ? Math.round(productData.price * (1 - productData.discountPercent / 100))
    : null;

  return (
    <div
      className="w-full cursor-pointer group overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/product/${productData.slug}`)}
    >
      {/* Image section */}
      <div className="relative w-full aspect-[166/196] md:aspect-[329/364] overflow-hidden bg-[#F8FAFC]">
        {/* Discount Badge */}
        {productData.discountPercent && (
          <div className="absolute top-2 left-2 bg-[#F04438] rounded-[2px] py-[3px] px-2 z-[5]">
            <p className="text-[12px] font-normal text-white uppercase">
              СКИДКА -{productData.discountPercent}%
            </p>
          </div>
        )}

        {/* Wishlist (hover) */}
        <AnimatePresence>
          {(hovered || inWishlist) && (
            <motion.button
              key="wishlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuthenticated) {
                  openAuth();
                  return;
                }
                if (inWishlist) {
                  remove(productData.slug);
                  toast.success(t("removedFromWishlist"));
                } else {
                  add(productData.slug, locale);
                  toast.success(t("addedToWishlist"));
                }
              }}
              className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center z-[5] cursor-pointer"
            >
              <Image
                src={
                  inWishlist ? "/icons/heart-filled.svg" : "/icons/heart.svg"
                }
                alt="Wishlist"
                width={20}
                height={20}
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Image */}
        <Image
          src={
            productData.images?.[0]?.image || "/images/product-placeholder.png"
          }
          alt={productData.name || "Product Image"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover w-full h-full pointer-events-none transition-transform duration-300 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
        />

        {/* Overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0 bg-[#F8F9FB]/80"
            />
          )}
        </AnimatePresence>

        {/* Add to Cart button */}
        <AnimatePresence>
          {hovered && onOpen && (
            <motion.div
              key="cta"
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 28, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 z-10"
            >
              <Button
                className="w-full h-[36px] uppercase text-[12px] font-medium tracking-wide text-white bg-black rounded-md cursor-pointer"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // prevent routing
                  handleOpen(product);
                }}
              >
                {t("addToCart")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="flex flex-col items-start gap-1 pt-2">
        <p className="text-sm font-light text-[#9AA4B2]">
          {productData.category?.name}
        </p>

        <p className="truncate text-sm font-light text-black">
          {productData.name}
        </p>

        {/* Price & Discounted Price */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 mb-3">
          {/* Discounted Price */}
          {discountedPrice ? (
            <>
              <p className="text-lg font-medium text-black">
                {discountedPrice.toLocaleString()} {t("uzs")}
              </p>

              {/* Old Price */}
              <p className="text-sm line-through text-[#9AA4B2]">
                {productData?.price?.toLocaleString()} {t("uzs")}
              </p>
            </>
          ) : (
            <p className="text-lg font-medium text-black">
              {productData?.price?.toLocaleString()} {t("uzs")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
