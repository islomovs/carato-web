"use client";

import { AnimatePresence, motion } from "framer-motion";
import ProductCard, { Product } from "@/components/shared/ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
      <AnimatePresence mode="popLayout">
        {products.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
