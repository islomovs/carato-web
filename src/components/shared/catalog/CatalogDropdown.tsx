"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { NavButton } from "@/components/ui/nav-button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCategoriesCatalogue,
  useCategoryCatalogue,
} from "@/hooks/useCategoriesCatalogue";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type CatalogDropdownProps = {
  isOpen: boolean;
  setIsCatalogOpen: (open: boolean) => void;
};

export default function CatalogDropdown({
  isOpen,
  setIsCatalogOpen,
}: CatalogDropdownProps) {
  const router = useRouter();

  const { catalogues, loading } = useCategoriesCatalogue();
  const [selectedCatalogue, setSelectedCatalogue] = React.useState("");

  useEffect(() => {
    if (catalogues.length > 0) {
      setSelectedCatalogue(catalogues[0].slug);
    }
  }, [catalogues]);

  const { catalogue: selected, loading: selectedLoading } =
    useCategoryCatalogue(selectedCatalogue);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="
            absolute left-0 right-0 top-full
            bg-white border-t border-[#EEF2F6]
            z-50 h-[100vh] overflow-y-auto shadow-md
          "
        >
          <div className="flex bg-white h-[90vh] overflow-y-auto">
            {loading ? (
              <div className="border-r border-gray-100 flex flex-col p-8 gap-4 w-[230px]">
                {/* Simulate 4 catalogue items */}
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <div className="border-r border-gray-100 flex flex-col p-8 gap-4 max-w-[230px]">
                {catalogues.map((cat) => (
                  <NavButton
                    key={cat.id}
                    active={selectedCatalogue === cat.slug}
                    onClick={() => {
                      setSelectedCatalogue(cat.slug);
                    }}
                    className="w-full text-left rounded-md transition-colors duration-200"
                  >
                    {cat.name}
                  </NavButton>
                ))}
              </div>
            )}

            <div className="flex flex-1 p-8 gap-10">
              {/* left part: button + subcategories list */}
              <div className="flex-1 flex flex-col">
                {/* Top button */}
                <div className="mb-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push(`/products/${selectedCatalogue}`);
                      setIsCatalogOpen(false);
                    }}
                    className="h-9 text-sm p-2 border border-black rounded-md text-black font-normal hover:bg-black hover:text-white transition-colors uppercase flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>Посмотреть все</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Subcategories + sub-subcategories */}

                {selectedLoading || loading ? (
                  <div className="columns-3 gap-14 w-full">
                    {[1, 2, 3].map((col) => (
                      <div key={col} className="mb-6 break-inside-avoid-column">
                        {/* Subcategory title */}
                        <Skeleton className="h-5 w-[120px] mb-3 rounded-md" />

                        {/* Sub-subcategories */}
                        <div className="flex flex-col gap-3">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton
                              key={i}
                              className="h-4 w-[100px] rounded-md"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="columns-3 gap-14 overflow-y-auto">
                    {selected?.categories?.map((sub) => (
                      <div
                        key={sub.name}
                        className="mb-6 break-inside-avoid-column"
                      >
                        <NavButton
                          variant="bold"
                          active
                          className="text-left mb-3 font-bold cursor-pointer"
                          onClick={() => {
                            router.push(`/products/${sub.slug}`);
                            setIsCatalogOpen(false);
                          }}
                        >
                          {sub.name}
                        </NavButton>

                        {sub.subcategories && (
                          <div className="flex flex-col gap-3">
                            {sub.subcategories.map((subsub) => (
                              <NavButton
                                key={subsub.name}
                                active={selectedCatalogue === subsub.name}
                                onClick={() => {
                                  router.push(`/products/${subsub.slug}`);
                                  setIsCatalogOpen(false);
                                }}
                                className={`w-fit text-left rounded-md transition-colors duration-200 ${
                                  selectedCatalogue === subsub.name
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
                )}
              </div>

              {selectedLoading ? (
                <div className="flex flex-col flex-1 items-end gap-8 w-[240px] shrink-0">
                  {[1, 2].map((i) => (
                    <Skeleton
                      key={i}
                      className="w-[360px] h-[300px] rounded-md"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col flex-1 items-end gap-8 shrink-0 h-full max-w-[360px]">
                  <div className="w-full flex-[2] relative">
                    <Image
                      src={
                        selected?.categories?.[0]?.desktopImage ||
                        "/images/promo1.jpg"
                      }
                      alt="promo-big"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="w-full flex-[1] relative">
                    <Image
                      src="/images/promo2.jpg"
                      alt="promo-small"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
