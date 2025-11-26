"use client";

import { useEffect, useState } from "react";
import { Briefcase, TrendingUp, DollarSign, Target, BarChart3 } from "lucide-react";
import { StatsCard } from "./StatsCard";

interface InvestorStatsData {
  totalInvestments: number;
  portfolioValue: number;
  activeInvestments: number;
  avgReturn: number;
  totalStartups: number;
}

export function InvestorStats() {
  const [stats, setStats] = useState<InvestorStatsData>({
    totalInvestments: 0,
    portfolioValue: 0,
    activeInvestments: 0,
    avgReturn: 0,
    totalStartups: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestorStats = async () => {
      try {

        const mockInvestorId = "INV001";
        

        await new Promise(resolve => setTimeout(resolve, 1000));
        

        const mockStats = {
          totalInvestments: 125000, 
          portfolioValue: 142000,
          activeInvestments: 8,
          avgReturn: 13.6, 
          totalStartups: 12, 
        };

        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching investor stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestorStats();
  }, []);

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

  const returnPercentage = ((stats.portfolioValue - stats.totalInvestments) / stats.totalInvestments) * 100;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <StatsCard
        title="Portfolio Value"
        value={`$${stats.portfolioValue.toLocaleString()}`}
        change={`+$${(stats.portfolioValue - stats.totalInvestments).toLocaleString()} (${returnPercentage.toFixed(1)}%)`}
        changeType={returnPercentage > 0 ? "positive" : returnPercentage < 0 ? "negative" : "neutral"}
        icon={<DollarSign className="h-6 w-6 text-primary" />}
      />
      
      <StatsCard
        title="Total Invested"
        value={`$${stats.totalInvestments.toLocaleString()}`}
        change={`Across ${stats.totalStartups} startups`}
        changeType="neutral"
        icon={<Briefcase className="h-6 w-6 text-primary" />}
      />
      
      <StatsCard
        title="Active Investments"
        value={stats.activeInvestments.toString()}
        change={`${Math.round((stats.activeInvestments / stats.totalStartups) * 100)}% of portfolio`}
        changeType={stats.activeInvestments > 0 ? "positive" : "neutral"}
        icon={<Target className="h-6 w-6 text-primary" />}
      />
      
      <StatsCard
        title="Avg Return"
        value={`${stats.avgReturn.toFixed(1)}%`}
        change={stats.avgReturn >= 15 ? "Excellent!" : stats.avgReturn >= 10 ? "Good performance" : "Room for improvement"}
        changeType={stats.avgReturn >= 15 ? "positive" : stats.avgReturn >= 10 ? "neutral" : "negative"}
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
      />
      
      <StatsCard
        title="Portfolio Diversity"
        value={stats.totalStartups.toString()}
        change={stats.totalStartups >= 10 ? "Well diversified" : "Consider diversifying"}
        changeType={stats.totalStartups >= 10 ? "positive" : stats.totalStartups >= 5 ? "neutral" : "negative"}
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
      />
    </div>
  );
}