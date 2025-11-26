import { InvestorStats } from "@/components/dashboard/InvestorStats";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { InvestmentActivity } from "@/components/dashboard/InvestmentActivity";
import { GrowthInsights } from "@/components/dashboard/GrowthInsights";

export default function InvestorDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Investment Dashboard</h1>
        <p className="text-muted-foreground">
          Track your portfolio performance and discover new opportunities.
        </p>
      </div>

      <InvestorStats />

      <GrowthInsights />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <PortfolioOverview />
        </div>
        
        <div className="space-y-6">
          <InvestmentActivity />
        </div>
      </div>
    </div>
  );
}