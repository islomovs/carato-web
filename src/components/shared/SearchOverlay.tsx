"use client";

import Image from "next/image";
import { TextField } from "@/components/shared/TextField";
import ProductCard from "@/components/shared/product/ProductCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { Product } from "@/services/product";
import { useMemo } from "react";
import { Spinner } from "@/components/ui/spinner";
import { EmptySearch } from "./EmptySearch";
import { motion, AnimatePresence, easeOut, easeIn } from "framer-motion";

const panelVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2, ease: easeIn },
  },
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const router = useRouter();

  const initialFilters = useMemo(() => ({ search: "" }), []);

  const { products, loading, updateFilters } = useProducts(
    3,
    initialFilters,
    true
  );

  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    if (!query.trim()) return;
    updateFilters({
      search: debouncedQuery,
    });
  }, [debouncedQuery, updateFilters, query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      updateFilters({ search: "" });
    }
  }, [debouncedQuery, updateFilters]);

  const hasQuery = debouncedQuery.trim().length > 0;

  const highlightQuery = (text: string) => {
    const q = debouncedQuery.toUpperCase();
    const upper = text.toUpperCase();

    if (!upper.startsWith(q)) return <span>{text}</span>;

    return (
      <>
        <span className="text-[#9AA4B2]">{text.slice(0, q.length)}</span>
        <span className="text-black">{text.slice(q.length)}</span>
      </>
    );
  };

  return (
    <>
      {/* SEARCH BAR */}
      <div className="fixed top-0 md:top-16 py-[10px] md:py-8 md:h-[108px] left-0 w-full bg-white z-50 px-4 md:px-8 border-b border-b-[#EEF2F6]">
        <div className="relative">
          <Image
            src="/icons/search.svg"
            alt="search"
            width={20}
            height={20}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />

          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <Image
              src="/icons/x-close.svg"
              alt="close"
              width={20}
              height={20}
            />
          </button>

          <TextField
            placeholder="Что вы ищете?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
        </div>
      </div>

      {/* RESULTS */}
      <AnimatePresence>
        {hasQuery && (
          <motion.div
            className="fixed left-0 w-full z-50 top-[68px] md:top-[144px] bottom-0"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-white px-4 py-1 md:p-8 min-h-[320px] h-full overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    className="flex items-center justify-center h-full"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <Spinner className="text-black" />
                  </motion.div>
                ) : products.length === 0 ? (
                  <motion.div
                    key="empty"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="h-full"
                  >
                    <EmptySearch query={debouncedQuery} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    className="flex flex-col md:flex-row gap-8"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {/* RECOMMENDATIONS */}
                    <div className="w-full md:w-[212px] shrink-0">
                      <div className="border-b border-black py-[10px] md:py-3">
                        <p className="text-xs font-medium uppercase leading-[18px]">
                          Рекомендуем
                        </p>
                      </div>

                      <div className="mt-3 md:mt-5">
                        {products.map((p: Product) => (
                          <div
                            key={p.id}
                            className="md:h-[64px] py-3 uppercase text-sm leading-[20px] cursor-pointer"
                            onClick={() => {
                              onClose();
                              router.push(`/product/${p.slug}`);
                            }}
                          >
                            {highlightQuery(p.name)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PRODUCTS */}
                    <div className="flex-1">
                      <div className="border-b border-black py-[10px] md:py-3">
                        <p className="text-xs font-medium uppercase leading-[18px]">
                          Продукты
                        </p>
                      </div>

                      <div className="mt-3 md:mt-5">
                        {/* MOBILE: horizontal scroll */}
                        <div className="flex md:hidden gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
                          {products.map((product: Product) => (
                            <div
                              key={product.slug}
                              className="min-w-[300px] flex-shrink-0"
                              onClick={onClose}
                            >
                              <ProductCard
                                product={product}
                                onOpen={onClose}
                              />
                            </div>
                          ))}
                        </div>

                        {/* DESKTOP: grid */}
                        <motion.div
                          className="hidden md:grid grid-cols-3 gap-5"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            visible: {
                              transition: { staggerChildren: 0.06 },
                            },
                          }}
                        >
                          {products.map((product: Product) => (
                            <motion.div
                              key={product.slug}
                              variants={{
                                hidden: { opacity: 0, y: 8 },
                                visible: { opacity: 1, y: 0 },
                              }}
                              onClick={onClose}
                            >
                              <ProductCard
                                product={product}
                                onOpen={onClose}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>

                      {!loading && products.length > 0 && (
                        <div className="mt-6 md:mt-[52px] flex justify-center mb-[56px]">
                          <Button
                            variant="outline"
                            className="w-full md:w-[280px] h-9 uppercase text-xs font-normal border border-black hover:bg-black hover:text-white cursor-pointer"
                            onClick={() =>
                              router.push(`/search?query=${debouncedQuery}`)
                            }
                          >
                            Смотреть все
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-white md:bg-[#00000040] z-40 top-16 md:top-[172px]"
        onClick={onClose}
      />
    </>
  );
}
