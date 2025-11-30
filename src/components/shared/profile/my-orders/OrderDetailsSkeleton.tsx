"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full md:gap-10">
      {/* Status + Rows */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Products section placeholder */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-5 w-32" />

        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4].map((x) => (
            <Skeleton key={x} className="w-16 h-16 rounded-md flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Bottom summary */}
      <div className="flex flex-col gap-4 mt-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  );
}
