"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Briefcase, TrendingUp, DollarSign, Target, BarChart3 } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface InvestorStatsData {
  totalInvested: number;
  totalCurrentValue: number;
  totalROI: number;
  portfolioCount: number;
  avgInvestment: number;
}

export function InvestorStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<InvestorStatsData>({
    totalInvested: 0,
    totalCurrentValue: 0,
    totalROI: 0,
    portfolioCount: 0,
    avgInvestment: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestorStats = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/investor/dashboard?userId=${session.user.id}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Error fetching investor stats:', error);
        // Fallback to empty stats
        setStats({
          totalInvested: 0,
          totalCurrentValue: 0,
          totalROI: 0,
          portfolioCount: 0,
          avgInvestment: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorStats();
  }, [session]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Show empty state if no investments
  if (stats.portfolioCount === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Portfolio Value"
          value="$0"
          change="No investments yet"
          changeType="neutral"
          icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
        />
        
        <StatsCard
          title="Total Invested"
          value="$0"
          change="Start your journey"
          changeType="neutral"
          icon={<Briefcase className="h-6 w-6 text-muted-foreground" />}
        />
        
        <StatsCard
          title="Active Investments"
          value="0"
          change="Discover startups"
          changeType="neutral"
          icon={<Target className="h-6 w-6 text-muted-foreground" />}
        />
        
        <StatsCard
          title="ROI"
          value="0.0%"
          change="Track performance"
          changeType="neutral"
          icon={<TrendingUp className="h-6 w-6 text-muted-foreground" />}
        />

        <StatsCard
          title="Avg Investment"
          value="$0"
          change="Plan your strategy"
          changeType="neutral"
          icon={<BarChart3 className="h-6 w-6 text-muted-foreground" />}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <StatsCard
        title="Portfolio Value"
        value={`$${stats.totalCurrentValue.toLocaleString()}`}
        change={`+$${(stats.totalCurrentValue - stats.totalInvested).toLocaleString()} (${stats.totalROI.toFixed(1)}%)`}
        changeType={stats.totalROI > 0 ? "positive" : stats.totalROI < 0 ? "negative" : "neutral"}
        icon={<DollarSign className="h-6 w-6 text-primary" />}
      />
      
      <StatsCard
        title="Total Invested"
        value={`$${stats.totalInvested.toLocaleString()}`}
        change={`Across ${stats.portfolioCount} startups`}
        changeType="neutral"
        icon={<Briefcase className="h-6 w-6 text-primary" />}
      />
      
      <StatsCard
        title="Active Investments"
        value={stats.portfolioCount.toString()}
        change={stats.portfolioCount > 0 ? "Portfolio active" : "Start investing"}
        changeType={stats.portfolioCount > 0 ? "positive" : "neutral"}
        icon={<Target className="h-6 w-6 text-primary" />}
      />
      
      <StatsCard
        title="ROI"
        value={`${stats.totalROI.toFixed(1)}%`}
        change={stats.totalROI >= 15 ? "Excellent!" : stats.totalROI >= 10 ? "Good performance" : stats.totalROI >= 0 ? "Positive returns" : "Room for improvement"}
        changeType={stats.totalROI >= 15 ? "positive" : stats.totalROI >= 0 ? "neutral" : "negative"}
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
      />
      
      <StatsCard
        title="Avg Investment"
        value={`$${stats.avgInvestment.toLocaleString()}`}
        change={stats.portfolioCount >= 10 ? "Well diversified" : stats.portfolioCount >= 5 ? "Good spread" : "Consider diversifying"}
        changeType={stats.portfolioCount >= 10 ? "positive" : stats.portfolioCount >= 5 ? "neutral" : "negative"}
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
      />
    </div>
  );
}