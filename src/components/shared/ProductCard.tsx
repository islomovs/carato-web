"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="w-full cursor-pointer group overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image section */}
      <div className="relative w-full aspect-[166/196] md:aspect-[329/364] overflow-hidden rounded-md">
        <Image
          src={product.image}
          alt={product.title}
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

        {/* Button animation */}
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
                className="w-full h-[36px] uppercase text-[12px] font-medium tracking-wide text-white bg-black rounded-md"
                size="sm"
                onClick={() => console.log("Add to cart clicked", product.id)}
              >
                Add to Cart
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="flex flex-col items-start gap-1 pt-2">
        <p className="text-sm font-light text-[#9AA4B2]">Браслеты</p>
        <p className="truncate text-sm font-light text-black">
          {product.title}
        </p>
        <p className="text-lg font-medium text-black mb-3">
          {product.price} UZS
        </p>
      </div>
    </div>
  );
}
