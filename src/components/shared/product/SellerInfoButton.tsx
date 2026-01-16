"use client";

import { Star, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import { useTranslations } from "next-intl";
import { Seller } from "@/services/product";

interface Props {
  seller: Seller | null;
}

export default function SellerInfoButton({ seller }: Props) {
  const t = useTranslations("product");
  const router = useRouter();

  return (
    <Button
      variant="link"
      onClick={() => seller && router.push(`/seller/${seller.slug}`)}
      className="flex items-center gap-3 w-full !p-0 rounded-md cursor-pointer hover:underline-none "
    >
      <div className="w-12 h-12 flex-shrink-0">
        <Image
          src={seller?.image || "/images/seller-placeholder.jpg"}
          alt={seller?.name || "Seller"}
          width={48}
          height={48}
          className="rounded-[4px] object-cover w-full h-full"
        />
      </div>

      <div className="flex-1 flex flex-col gap-[2px] text-left">
        <span className="font-[400] text-[16px]">
          {seller?.name || "Seller"}
        </span>
        <div className="flex gap-[4px] items-center">
          {Array.from({ length: 5 }).map((_, index) => {
            const filled = index < Math.round(seller?.averageReviewRating || 5);
            return (
              <Star
                key={index}
                size={16}
                className={`${
                  filled ? "fill-[#FAC515] text-[#FAC515]" : "text-[#FAC515]"
                }`}
                strokeWidth={filled ? 0 : 1.5}
              />
            );
          })}

          <span className="font-light text-sm underline ml-2">
            {seller?.reviewsQuantity || 10} {t("reviews")}
          </span>
        </div>
      </div>

      <ChevronRight className="text-black w-5 h-5" />
    </Button>
  );
}
