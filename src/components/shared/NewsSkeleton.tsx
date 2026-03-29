import { Skeleton } from "@/components/ui/skeleton";

export default function NewsSkeleton() {
  return (
    <div className="w-full">
      <div className="relative w-full h-[240px] md:h-[618px]">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="px-4 md:px-0 mt-2 md:mt-3 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}