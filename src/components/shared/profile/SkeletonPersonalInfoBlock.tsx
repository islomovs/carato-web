"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonPersonalInfoBlock() {
  return (
    <div className="w-full flex flex-col gap-10 max-w-[910px]">
      {/* CONTACT INFO */}
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-40" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* ADDRESS INFO */}
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-40" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="h-10 w-32 self-center" />
    </div>
  );
}
