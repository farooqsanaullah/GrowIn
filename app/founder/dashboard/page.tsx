import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentStartups } from "@/components/dashboard/RecentStartups";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { GrowthInsights } from "@/components/dashboard/GrowthInsights";

export default function FounderDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your startups today.
        </p>
      </div>

      <DashboardStats />

      <GrowthInsights />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <RecentStartups />
        </div>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <RecentActivity />
          </div>
        </div>
      </div>

    </div>
  );
}