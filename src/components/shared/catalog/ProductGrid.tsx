"use client";

import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "@/components/shared/product/ProductCard";
import { Product } from "@/services/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import ProductsBlockModal from "../product/ProductsBlockModal";
import { WishlistItem } from "@/services/wishlist";
import useLockScroll from "@/hooks/useLockScroll";
import { isWishlistItem } from "../product/ProductCard";

interface ProductGridProps {
  products: Product[] | WishlistItem[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  const skeletons = Array.from({ length: 8 });
  const [selectedProduct, setSelectedProduct] = useState<
    Product | WishlistItem | null
  >(null);
  const handleOpen = (product: Product | WishlistItem) => {
    setSelectedProduct(product);
  };
  const handleClose = () => setSelectedProduct(null);

  useLockScroll(selectedProduct ? true : false);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {loading ? (
          skeletons.map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="w-full h-[170px] lg:h-[220px] rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {products.map((p) => {
              const productData: Product = isWishlistItem(p)
                ? (p as Product)
                : p;
              return (
                <motion.div
                  key={productData.slug}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ProductCard product={p} onOpen={handleOpen} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
      {selectedProduct && (
        <ProductsBlockModal
          slug={
            isWishlistItem(selectedProduct)
              ? selectedProduct.slug
              : selectedProduct.slug
          }
          onClose={handleClose}
          selectedProduct={
            isWishlistItem(selectedProduct) ? selectedProduct : selectedProduct
          }
        />
      )}
    </>
  );
}
