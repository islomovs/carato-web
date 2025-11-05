"use client";

import { Star, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

type Props = {
  imageSrc: string;
  title: string;
  rating: number;
  totalStars?: number;
  sellerUrl: string;
};

export default function SellerInfoButton({
  imageSrc,
  title,
  rating,
  totalStars = 5,
  sellerUrl,
}: Props) {
  const router = useRouter();

  return (
    <Button
      variant="link"
      onClick={() => router.push(sellerUrl)}
      className="flex items-center gap-3 w-full !p-0 rounded-md hover:bg-gray-50 cursor-pointer"
    >
      <div className="w-12 h-12 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={title}
          width={48}
          height={48}
          className="rounded-[4px] object-cover w-full h-full"
        />
      </div>

      <div className="flex-1 flex flex-col gap-[2px] text-left">
        <span className="font-[400] text-[16px]">{title}</span>
        <div className="flex gap-[4px] items-center">
          {Array.from({ length: totalStars }).map((_, index) => {
            const filled = index < rating;
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

          <span className="font-light text-sm underline ml-2">4 отзыва</span>
        </div>
      </div>

      <ChevronRight className="text-black w-5 h-5" />
    </Button>
  );
}
