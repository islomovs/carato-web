"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard, { Product } from "../shared/ProductCard";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Dialog } from "@/components/ui/dialog";
import ProductGallery from "../shared/ProductGallery";
import ProductInfo from "../shared/ProductInfo";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";

interface ProductsBlockProps {
  title: string;
  products: Product[];
  layout?: "carousel" | "grid";
  hideSeeAll?: boolean;
}

export default function ProductsBlock({
  title,
  products,
  layout = "carousel",
  hideSeeAll = false,
}: ProductsBlockProps) {
  const t = useTranslations("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpen = (product: Product) => setSelectedProduct(product);
  const handleClose = () => setSelectedProduct(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (selectedProduct) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [selectedProduct]);

  return (
    <>
      <div className="flex flex-col items-start my-20 md:my-40 mx-4 md:mx-8 overflow-hidden">
        <h1 className="text-[28px] md:text-[52px] mb-4 md:mb-[52px] font-light text-black">
          {title}
        </h1>

        {layout === "carousel" ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={products.length > 1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            className="w-full !overflow-hidden"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div onClick={() => handleOpen(product)}>
                  <ProductCard product={product} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 w-full">
            {products.map((product) => (
              <div key={product.id} onClick={() => handleOpen(product)}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {!hideSeeAll && (
          <Button
            variant="outline"
            className="mt-6 md:mt-20 w-full md:w-[280px] h-[36px] md:h-[52px] text-sm uppercase font-normal rounded-md bg-white text-black border border-black hover:bg-black hover:!text-white transition-colors duration-200 cursor-pointer md:self-center"
          >
            {t("seeAll")}
          </Button>
        )}
      </div>

      {/* ------------- PRODUCT MODAL / BOTTOM SHEET ------------- */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        {/* We render our custom structure inside the Dialog (keeps accessibility/portal behavior) */}
        <AnimatePresence>
          {selectedProduct && (
            <>
              {/* Mobile bottom sheet */}
              <div className="fixed inset-0 z-50 bg-black/60 md:hidden">
                <motion.div
                  className="absolute bottom-0 left-0 w-full bg-white rounded-t-[24px] overflow-hidden"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(event, info) => {
                    const verticalOffset = info.offset.y;
                    const horizontalOffset = info.offset.x;

                    if (
                      verticalOffset > 100 &&
                      Math.abs(verticalOffset) > Math.abs(horizontalOffset) * 2
                    ) {
                      handleClose();
                    }
                  }}
                >
                  <div className="flex justify-center pt-2 pb-4">
                    <div className="h-[5px] w-[48px] rounded-[7px] bg-[#E5E5E5]" />
                  </div>

                  <div className="h-[calc(85vh)] overflow-y-auto flex flex-col">
                    <div className="flex-[0.41] w-full flex items-center justify-center bg-gray-50">
                      <ProductGallery
                        variant="modal"
                        media={[
                          {
                            id: 1,
                            type: "image",
                            src: "/images/news-placeholder.png",
                          },
                          {
                            id: 2,
                            type: "video",
                            src: "/videos/placeholder-video.mp4",
                          },
                        ]}
                      />
                    </div>
                    <div className="w-full p-4">
                      <ProductInfo />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Desktop centered modal */}
              <motion.div
                className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) handleClose();
                }}
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Modal content */}
                <motion.div
                  className="relative bg-white rounded-2xl w-[70vw] max-h-[90vh] overflow-hidden shadow-xl z-10 flex p-10 gap-8"
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                >
                  {/* Close button */}
                  <Button
                    variant="ghost"
                    onClick={handleClose}
                    className="absolute top-6 right-6 flex items-center justify-center opacity-70 hover:opacity-100 transition cursor-pointer"
                  >
                    <Image
                      src="/icons/x-close.svg"
                      alt="Close"
                      width={20}
                      height={20}
                    />
                  </Button>

                  {/* Gallery + Info with equal height */}
                  <div className="flex w-full h-full items-stretch gap-8">
                    <div className="flex-[0.48] bg-gray-50 flex items-center justify-center overflow-hidden">
                      <ProductGallery
                        variant="modal"
                        media={[
                          {
                            id: 1,
                            type: "image",
                            src: "/images/news-placeholder.png",
                          },
                          {
                            id: 2,
                            type: "video",
                            src: "/videos/placeholder-video.mp4",
                          },
                        ]}
                      />
                    </div>

                    <div className="flex-[0.52] overflow-y-auto pr-2">
                      <ProductInfo />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  );
}
