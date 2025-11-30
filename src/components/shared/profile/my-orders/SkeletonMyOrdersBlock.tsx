import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonMyOrdersBlock() {
  return (
    <div className="w-full max-w-[910px] flex flex-col gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 border border-[#CDD5DF] py-4"
        >
          <div className="flex flex-row justify-between px-6 gap-4">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>

          {/* Scrollable product images */}
          <div className="flex flex-row gap-2 px-6">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton
                key={j}
                className="h-16 w-16 flex-shrink-0 rounded-md"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
