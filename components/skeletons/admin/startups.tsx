import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonStartups = () => (
  <Card className="flex flex-col sm:flex-row justify-between p-4 animate-pulse">
    {/* Left */}
    <div className="flex flex-col gap-2">
      <div className="flex items-start sm:items-center gap-4">
        <Skeleton className="h-16 w-24 rounded-lg" />
        <div className="flex flex-col gap-1 w-full">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>

    {/* Middle */}
    <div className="flex flex-col sm:items-center gap-4 mt-2 sm:mt-0">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
    </div>

    {/* Right */}
    <div className="flex items-center gap-3 px-4 py-8 mt-2 sm:mt-0">
      <Skeleton className="h-6 w-24 rounded-sm" /> {/* Status placeholder */}
      <Skeleton className="h-6 w-32 rounded-sm" /> {/* Equity placeholder */}
    </div>
  </Card>
);