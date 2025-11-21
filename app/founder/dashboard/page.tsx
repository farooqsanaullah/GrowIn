import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentStartups } from "@/components/dashboard/RecentStartups";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { StartupPerformance } from "@/components/dashboard/StartupPerformance";
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

      <AnalyticsSection />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <RecentStartups />
          <div className="grid gap-8 md:grid-cols-2">
            <StartupPerformance />
            <RecentActivity />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href="/founder/startups/new"
                className="block p-3 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
              >
                <div className="font-medium text-primary">Create New Startup</div>
                <div className="text-sm text-muted-foreground">Start your next venture</div>
              </a>
              <a
                href="/founder/profile"
                className="block p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="font-medium text-card-foreground">Update Profile</div>
                <div className="text-sm text-muted-foreground">Keep your info current</div>
              </a>
              <a
                href="/founder/startups"
                className="block p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="font-medium text-card-foreground">Manage Startups</div>
                <div className="text-sm text-muted-foreground">Edit and organize your ventures</div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <GrowthInsights />
    </div>
  );
}