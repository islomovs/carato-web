import { useEffect, useState } from "react";
import { getProductBySlug, Product } from "@/services/product";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@/components/ui/dialog";
import ProductGallery from "../product/ProductGallery";
import ProductInfo from "../product/ProductInfo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLocale } from "next-intl";

export default function ProductsBlockModal({
  slug,
  onClose,
  selectedProduct,
}: {
  slug: string;
  onClose: () => void;
  selectedProduct: Product;
}) {
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    getProductBySlug(slug, locale)
      .then((data) => setProduct(data))
      .finally(() => setLoading(false));
  }, [slug, locale]);

  const handleClose = () => onClose();

  const finalProduct = product || selectedProduct;

  return (
    <Dialog open={!!slug} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {slug && (
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
                      media={selectedProduct?.images.map((img, index) => ({
                        id: index,
                        type: "image",
                        src: img?.image,
                      }))}
                    />
                  </div>
                  <div className="w-full p-4">
                    <ProductInfo
                      product={finalProduct}
                      isLoading={loading || !finalProduct?.variants}
                    />
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
              <div
                className="absolute inset-0 bg-black/60"
                onClick={handleClose}
              />

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
                  <div className="flex-[0.48] flex items-center justify-center overflow-hidden">
                    <ProductGallery
                      variant="modal"
                      media={selectedProduct?.images.map((img, index) => ({
                        id: index,
                        type: img?.image?.endsWith(".mp4") ? "video" : "image", // detect video or image
                        src: img?.image,
                      }))}
                    />
                  </div>

                  <div className="flex-[0.52] overflow-y-auto pr-2">
                    <ProductInfo
                      product={finalProduct}
                      isLoading={loading || !finalProduct?.variants}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
