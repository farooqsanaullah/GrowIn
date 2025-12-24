import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonFounder = () => (
  <Card className="relative p-4 flex flex-col gap-3 animate-pulse">
    {/* Top: Profile Image + Startups badge */}
    <div className="relative w-full h-32 rounded-lg overflow-hidden">
      <Skeleton className="w-full h-full" />
      <Skeleton className="absolute top-2 right-2 w-20 h-6 rounded-sm" />
    </div>

    {/* Name + Activate/Deactivate Button */}
    <div className="flex justify-between items-center mt-2">
      <Skeleton className="h-5 w-24 rounded" />
      <Skeleton className="h-6 w-20 rounded" />
    </div>

    {/* Skills Dropdown */}
    <div className="mt-1">
      <Skeleton className="h-4 w-32 rounded mb-1" />
      <div className="flex flex-wrap gap-1">
        <Skeleton className="h-5 w-10 rounded" />
        <Skeleton className="h-5 w-12 rounded" />
        <Skeleton className="h-5 w-14 rounded" />
      </div>
    </div>

    {/* Separator */}
    <div className="border-t mt-2 pt-2" />

    {/* Location */}
    <div className="flex items-center gap-2 text-sm">
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className="h-4 w-20 rounded" />
    </div>
  </Card>
);
