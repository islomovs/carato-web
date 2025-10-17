"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { NavButton } from "@/components/ui/nav-button";
import { ArrowRight } from "lucide-react";

type CatalogDropdownProps = {
  categories: {
    id: string;
    name: string;
    sub: {
      name: string;
      subsub?: { name: string }[];
    }[];
    promos?: { img: string }[];
  }[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  isOpen: boolean;
};

export default function CatalogDropdown({
  categories,
  selectedCategory,
  setSelectedCategory,
  isOpen,
}: CatalogDropdownProps) {
  const selected = categories.find((c) => c.id === selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute left-0 right-0 bottom-0 top-full bg-white border-t border-[#EEF2F6] shadow-[0_2px_12px_rgba(0,0,0,0.05)] z-50"
        >
          <div className="flex bg-white">
            <div className="border-r border-gray-100 flex flex-col gap-4 p-8">
              {categories.map((cat) => (
                <NavButton
                  key={cat.id}
                  active={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="w-full text-left rounded-md transition-colors duration-200"
                >
                  {cat.name}
                </NavButton>
              ))}
            </div>

            <div className="flex flex-1 p-8 gap-10">
              {/* left part: button + subcategories list */}
              <div className="flex-1 flex flex-col">
                {/* Top button */}
                <div className="mb-4">
                  <Button
                    variant="outline"
                    className="h-9 text-sm p-2 border border-black rounded-md text-black font-normal hover:bg-black hover:text-white transition-colors uppercase flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>Посмотреть все</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Subcategories + sub-subcategories */}
                <div className="columns-3 gap-14">
                  {selected?.sub.map((sub) => (
                    <div
                      key={sub.name}
                      className="mb-6 break-inside-avoid-column"
                    >
                      <NavButton
                        variant="bold"
                        active
                        className="mb-3 font-bold"
                      >
                        {sub.name}
                      </NavButton>

                      {sub.subsub && (
                        <div className="flex flex-col gap-3">
                          {sub.subsub.map((subsub) => (
                            <NavButton
                              key={subsub.name}
                              active={selectedCategory === subsub.name}
                              onClick={() => setSelectedCategory(subsub.name)}
                              className={`w-fit text-left rounded-md transition-colors duration-200 ${
                                selectedCategory === subsub.name
                                  ? "font-bold underline"
                                  : ""
                              }`}
                            >
                              {subsub.name}
                            </NavButton>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* right part: two images stacked */}
              <div className="flex flex-col flex-1 items-end gap-8 w-[240px] shrink-0">
                {(
                  selected?.promos || [
                    { img: "/images/promo1.jpg" },
                    { img: "/images/promo2.jpg" },
                  ]
                ).map((promo, i) => (
                  <Image
                    key={i}
                    src={promo.img}
                    alt={`promo-${i}`}
                    width={360}
                    height={360}
                    className="object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
