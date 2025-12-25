import { DashboardStats } from "@/components/admin/DashboardStats";
import { GrowthInsights } from "@/components/admin/GrowthInsights";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">Super Admin Dashboard</h1>
        <DashboardStats />

        <GrowthInsights />
        
    </div>
  );
}
