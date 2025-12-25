import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonStartups = () => (
  <Card className="relative p-4 flex flex-col gap-3 animate-pulse">
    
    {/* Image Section */}
    <div className="relative w-full h-32 rounded-lg overflow-hidden">
      <Skeleton className="w-full h-full rounded-lg" />

      {/* Top-left: Industry */}
      <Skeleton className="absolute top-2 left-2 h-5 w-16 rounded-sm" />

      {/* Top-right: Category */}
      <Skeleton className="absolute top-2 right-2 h-5 w-16 rounded-sm" />
    </div>

    {/* Title + Description */}
    <div className="flex flex-col items-center gap-2 mt-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>

    {/* Status + Equity (Full width buttons) */}
    <div className="flex w-full gap-2 mt-1">
      <Skeleton className="h-8 w-full rounded-sm" />
      <Skeleton className="h-8 w-full rounded-sm" />
    </div>

    {/* Separator */}
    <div className="border-t mt-2 pt-2"></div>

    {/* Founders | Investors | Raised */}
    <div className="flex justify-between text-sm">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </Card>
);
