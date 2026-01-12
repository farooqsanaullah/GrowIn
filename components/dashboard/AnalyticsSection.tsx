"use client";

import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users, 
  Target,
  Calendar
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AnalyticsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
          <p className="text-muted-foreground">Track your startup performance and growth metrics</p>
        </div>
        <Select defaultValue="30">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Views"
          value="12,456"
          change="+15% from last month"
          changeType="positive"
          icon={<Eye className="h-6 w-6 text-primary" />}
        />
        
        <StatsCard
          title="Profile Visits"
          value="3,234"
          change="+8% from last month"
          changeType="positive"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        
        <StatsCard
          title="Startup Inquiries"
          value="156"
          change="+23% from last month"
          changeType="positive"
          icon={<Target className="h-6 w-6 text-primary" />}
        />
        
        <StatsCard
          title="Avg. Engagement"
          value="4.2%"
          change="-2% from last month"
          changeType="negative"
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
        />
      </div>
    </div>
  );
}