import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonInvestor = () => (
  <Card className="flex items-center justify-between p-4 space-x-4 animate-pulse">
    {/* Left */}
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-lg" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-40" />
      </div>
    </div>

    {/* Middle */}
    <div className="hidden sm:flex items-center gap-2">
      <Skeleton className="h-4 w-16" />
    </div>

    {/* Right */}
    <div className="flex items-center gap-3">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-24 rounded" />
    </div>
  </Card>
);