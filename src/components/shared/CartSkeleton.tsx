import React from "react";
import { Skeleton } from "../ui/skeleton";

export function CartSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-row gap-8 mt-8 items-start w-full">
      <div className="flex-1">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex flex-col gap-[10px]">
            {/* estimated delivery row */}
            <div className="flex items-center gap-2 text-sm border-b border-[#E5E7EB] py-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-16" />
            </div>

            {/* main item row */}
            <div className="relative flex flex-col items-start md:flex-row gap-5 md:w-full">
              {/* delete button (mobile) */}
              <div className="absolute top-0 right-0 md:hidden">
                <Skeleton className="w-5 h-5 rounded-sm" />
              </div>

              <div className="flex flex-row gap-5 md:w-full">
                {/* image */}
                <div className="relative w-20 md:w-[164px] h-20 md:h-[164px] flex items-center justify-center bg-gray-50">
                  <Skeleton className="w-[96px] h-[96px] md:w-[164px] md:h-[164px] rounded-md" />
                  {/* wishlist button mobile (top-left) */}
                  <div className="absolute top-0 left-0 md:hidden">
                    <Skeleton className="w-5 h-5 rounded-sm" />
                  </div>
                </div>

                {/* details */}
                <div className="flex-1 flex flex-col gap-4">
                  {/* product name */}
                  <Skeleton className="h-5 w-3/4 md:w-2/3" />

                  {/* Quantity + Size row (skeleton approximation of QuantitySizeRow) */}
                  <div className="flex items-center gap-3">
                    {/* qty controls */}
                    <Skeleton className="h-8 w-20 rounded-md" />
                    {/* size pill */}
                    <Skeleton className="h-8 w-16 rounded-md" />
                    {/* spacer for other controls */}
                    <div className="flex-1" />
                  </div>

                  {/* stock badge */}
                  <div className="w-fit">
                    <Skeleton className="h-5 w-28 rounded-sm" />
                  </div>

                  {/* mobile price block (visible on md:hidden) */}
                  <div className="flex md:hidden flex-col items-start">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-20 mt-2" />
                  </div>
                </div>

                {/* desktop price column */}
                <div className="hidden md:flex flex-col items-start md:items-start gap-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>

            {/* divider */}
            <div className="border-b pb-0.5 border-[#E5E7EB]" />
          </div>
        ))}
      </div>

      {/* Totals column skeleton (desktop fixed column placeholder) */}
      <div className="hidden md:block md:max-w-[400px] h-full rounded-md p-6 self-start w-full">
        <Skeleton className="h-6 w-36 mb-4" /> {/* "Ваш заказ" */}
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-12 w-full rounded-[10px]" />
        </div>
      </div>

      {/* mobile sticky totals skeleton (simulates bottom bar while loading) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
        <div className="border-t border-[#E5E7EB] p-4">
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-12 w-full rounded-[10px]" />
        </div>
      </div>
    </div>
  );
}
