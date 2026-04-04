"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Seller } from "@/services/product";
import SellerInfoCard from "./SellerInfoCard";
import SellerDetailDialog from "./SellerDetailDialog";
import SellerCatalog from "./SellerCatalog";

export default function SellerPageContent({ slug }: { slug: string }) {
  const t = useTranslations("seller");
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    // Try sessionStorage first (came from product page)
    const stored = sessionStorage.getItem("sellerData");
    if (stored) {
      const parsed = JSON.parse(stored) as Seller;
      // Verify it matches the slug in the URL
      if (parsed.slug === slug) {
        setSeller(parsed);
        return;
      }
    }
    // Fallback: fetch products by seller slug to get seller info
    // This handles direct URL navigation
    import("@/services/product").then(({ fetchAllProducts }) => {
      fetchAllProducts(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { page: 1, size: 1, sellerSlug: slug } as any,
        "ru",
      ).then((data) => {
        const firstProduct = data?.products?.content?.[0];
        if (firstProduct?.seller) setSeller(firstProduct.seller);
      });
    });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: seller?.name ?? "", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!seller) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-16 border-b border-[#EEF2F6] animate-pulse bg-gray-50" />
        <div className="mx-8 mt-8 h-[120px] rounded-[4px] bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="mx-8 mt-8 rounded-[4px] overflow-hidden"
          style={{ background: "#F8FAFC" }}
        >
          <SellerInfoCard
            seller={seller}
            onDetailOpen={() => setDetailOpen(true)}
            onShare={handleShare}
            variant="desktop"
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <SellerCatalog sellerSlug={seller.slug} active={true} />
        </div>
      </div>

      <SellerDetailDialog
        seller={seller}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
