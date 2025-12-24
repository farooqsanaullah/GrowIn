import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonInvestor = () => (
  <Card className="relative p-4 animate-pulse flex flex-col gap-3">
    {/* Top: Profile Image + Investments Badge */}
    <div className="relative w-full h-32 rounded-lg overflow-hidden">
      <Skeleton className="w-full h-full rounded-lg" />
      <Skeleton className="absolute top-2 right-2 h-6 w-24 rounded-sm" />
    </div>

    {/* Name + Status Button */}
    <div className="flex justify-between items-center mt-2">
      <Skeleton className="h-5 w-32 rounded" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>

    {/* Separator */}
    <div className="border-t mt-2 pt-2"></div>

    {/* Location */}
    <div className="flex items-center gap-2 text-sm">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-24 rounded" />
    </div>
  </Card>
);
