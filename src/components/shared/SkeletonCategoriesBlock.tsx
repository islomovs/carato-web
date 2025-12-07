"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCategoriesBlock() {
  return (
    <div className="flex flex-col gap-6 md:gap-[52px] w-full my-24 animate-in fade-in-50">
      <Skeleton className="h-10 w-48 mx-4 md:mx-8" />

      <div className="hidden md:grid grid-cols-3 gap-4 mx-4 md:mx-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-[320px] rounded-lg" />
        ))}
      </div>

      <div className="block md:hidden">
        <div className="flex gap-4 px-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="w-[70%] h-[400px] rounded-lg flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
