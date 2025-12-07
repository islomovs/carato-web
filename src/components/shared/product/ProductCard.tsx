"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Product } from "@/services/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  const t = useTranslations("product");
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const router = useRouter();

  const handleOpen = (product: Product) => onOpen(product);

  const discountedPrice = product.discountPercent
    ? Math.round(product.price * (1 - product.discountPercent / 100))
    : null;

  return (
    <div
      className="w-full cursor-pointer group overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/product/${product.slug}`)}
    >
      {/* Image section */}
      <div className="relative w-full aspect-[166/196] md:aspect-[329/364] overflow-hidden rounded-md">
        {/* Discount Badge */}
        {product.discountPercent && (
          <div className="absolute top-2 left-2 bg-[#F04438] rounded-[2px] py-[3px] px-2 z-10">
            <p className="text-[12px] font-normal text-white uppercase">
              СКИДКА -{product.discountPercent}%
            </p>
          </div>
        )}

        {/* Wishlist (hover) */}
        <AnimatePresence>
          {hovered && (
            <motion.button
              key="wishlist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setWishlisted((prev) => !prev);
                toast.success(
                  !wishlisted ? t("addedToWishlist") : t("removedFromWishlist")
                );
              }}
              className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center z-10 cursor-pointer"
            >
              <Image
                src={
                  wishlisted ? "/icons/heart-filled.svg" : "/icons/heart.svg"
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
          src={product.images[0]?.image || "/images/product-placeholder.png"}
          alt={product.name || "Product Image"}
          fill
          className="object-cover w-full h-full pointer-events-none transition-transform duration-300 group-hover:scale-105"
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
          {hovered && (
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
          {product.category.name}
        </p>

        <p className="truncate text-sm font-light text-black">{product.name}</p>

        {/* Price & Discounted Price */}
        <div className="flex items-center gap-2 mb-3">
          {/* Discounted Price */}
          {discountedPrice ? (
            <>
              <p className="text-lg font-medium text-black">
                {discountedPrice.toLocaleString()} {t("uzs")}
              </p>

              {/* Old Price */}
              <p className="text-sm line-through text-[#9AA4B2]">
                {product.price.toLocaleString()} {t("uzs")}
              </p>
            </>
          ) : (
            <p className="text-lg font-medium text-black">
              {product.price.toLocaleString()} {t("uzs")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
