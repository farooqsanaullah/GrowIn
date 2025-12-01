"use client";

import { useEffect, useState } from "react";
import { Building2, Users, Eye, TrendingUp, Target } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { startupsApi } from "@/lib/helpers/api/startups";
import { useSession } from "next-auth/react";
import type { Startup } from "@/lib/types/api";

interface DashboardStatsData {
  totalStartups: number;
  totalFollowers: number;
  activeStartups: number;
  avgRating: number;
  totalViews: number;
}

export function DashboardStats() {
  const { data: session } = useSession();
  const founderId = session?.user?.id;
  const [stats, setStats] = useState<DashboardStatsData>({
    totalStartups: 0,
    totalFollowers: 0,
    activeStartups: 0,
    avgRating: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!founderId) {
          setLoading(false);
          return;
        }

        const response = await startupsApi.getByFounder(founderId);


        if (response.success && response.data) {
          const startups = response.data;

          const totalFollowers = startups.reduce((acc, startup) => acc + startup.followers.length, 0);
          const activeStartups = startups.filter(startup => startup.status === 'active').length;
          const avgRating = startups.length > 0
            ? startups.reduce((acc, startup) => acc + startup.avgRating, 0) / startups.length
            : 0;

          // Mock total views calculation (in a real app, this would come from analytics)
          const totalViews = startups.reduce((acc, startup) => acc + (startup.followers.length * 12), 0);

          setStats({
            totalStartups: startups.length,
            totalFollowers,
            activeStartups,
            avgRating,
            totalViews,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <StatsCard
        title="Total Startups"
        value={stats.totalStartups.toString()}
        change={stats.totalStartups > 0 ? "Active portfolio" : "Get started"}
        changeType={stats.totalStartups > 0 ? "positive" : "neutral"}
        icon={<Building2 className="h-6 w-6 text-primary" />}
      />

      <StatsCard
        title="Total Views"
        value={stats.totalViews.toLocaleString()}
        change={`Across all startups`}
        changeType="neutral"
        icon={<Eye className="h-6 w-6 text-primary" />}
      />

      <StatsCard
        title="Total Followers"
        value={stats.totalFollowers.toLocaleString()}
        change={`${Math.round(stats.totalFollowers / Math.max(stats.totalStartups, 1))} avg per startup`}
        changeType="neutral"
        icon={<Users className="h-6 w-6 text-primary" />}
      />

      <StatsCard
        title="Active Startups"
        value={stats.activeStartups.toString()}
        change={`${Math.round((stats.activeStartups / Math.max(stats.totalStartups, 1)) * 100)}% active`}
        changeType={stats.activeStartups > 0 ? "positive" : "neutral"}
        icon={<Target className="h-6 w-6 text-primary" />}
      />

      <StatsCard
        title="Avg Rating"
        value={stats.avgRating.toFixed(1)}
        change={stats.avgRating >= 4 ? "Excellent!" : stats.avgRating >= 3 ? "Good performance" : "Room for improvement"}
        changeType={stats.avgRating >= 4 ? "positive" : stats.avgRating >= 3 ? "neutral" : "negative"}
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
      />
    </div>
  );
}