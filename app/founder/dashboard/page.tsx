import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentStartups } from "@/components/dashboard/RecentStartups";

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

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentStartups />
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
                href="/founder/analytics"
                className="block p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="font-medium text-card-foreground">View Analytics</div>
                <div className="text-sm text-muted-foreground">Track your performance</div>
              </a>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">New follower on EcoTech Solutions</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Profile viewed by investor</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">HealthTech AI status updated</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}