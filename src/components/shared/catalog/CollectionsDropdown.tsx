"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useCollections } from "@/hooks/useCollection";
import { Skeleton } from "@/components/ui/skeleton";

interface CollectionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollectionsDropdown({
  isOpen,
  onClose,
}: CollectionsDropdownProps) {
  const locale = useLocale();
  const { collections, loading } = useCollections(locale);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute left-0 right-0 top-full bg-white border-t border-[#EEF2F6] z-50 shadow-md max-h-[calc(100vh-65px)] overflow-y-auto"
        >
          <div className="p-8">
            {loading ? (
              <div className="grid grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="w-full h-[200px] rounded-md" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, 329px)" }}>
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    href={`/${locale}/collections/${collection.slug}`}
                    onClick={onClose}
                    className="flex flex-col gap-2 group"
                  >
                    {/* Image */}
                    <div
                      className="relative overflow-hidden bg-[#F8FAFC]"
                      style={{ width: 329, height: 200 }}
                    >
                      {collection.desktopImage ? (
                        <Image
                          src={collection.desktopImage}
                          alt={collection.title ?? "Collection"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#EEF2F6]" />
                      )}
                    </div>

                    {/* Title */}
                    <span
                      style={{
                        fontWeight: 300,
                        fontSize: 14,
                        lineHeight: "20px",
                      }}
                      className="text-black"
                    >
                      {collection.title ?? collection.slug}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
