"use client";
import { RefObject } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogHeader({
  refTitle,
  title,
}: {
  refTitle: RefObject<HTMLDivElement | null>;
  title?: string | null;
}) {
  return (
    <div className="w-full">
      <div
        ref={refTitle}
        className="flex items-center justify-center my-[52px]"
      >
        {title ? (
          <h1 className="text-[28px] leading-[34px] text-center font-[400]">
            {title}
          </h1>
        ) : (
          <Skeleton className="h-[34px] w-[240px] rounded-md" />
        )}
      </div>
    </div>
  );
}
