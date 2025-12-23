"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, Calendar } from "lucide-react";
import { startupsApi } from "@/lib/helpers/api/startups";
import { useSession } from "next-auth/react";

interface MonthlyData {
  month: string;
  followers: number;
  views: number;
  startups: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

export function GrowthInsights() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  const generateMonthlyData = (startups: any[]) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const currentMonth = new Date().getMonth();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const month = months[monthIndex];

      // Simulate growth data based on startups
      const baseFollowers = Math.max(50, startups.length * 20);
      const growth = Math.random() * 30 + 10; // 10-40% growth
      const followers = Math.floor(baseFollowers * (1 + (i * growth) / 100));

      last6Months.push({
        month,
        followers,
        views: followers * 8, // Approximate 8 views per follower
        startups: Math.min(startups.length, Math.floor(startups.length * (1 + i * 0.1))),
      });
    }

    return last6Months;
  };

  const generateCategoryData = (startups: any[]) => {
    const categories: { [key: string]: number } = {};
    // Use a robust, high-contrast palette that does not depend on CSS variables
    const colors = [
      "#4F46E5", // Indigo
      "#10B981", // Emerald
      "#F59E0B", // Amber
      "#EF4444", // Red
      "#6366F1", // Indigo-light
      "#22D3EE", // Cyan
      "#8B5CF6", // Violet
      "#14B8A6", // Teal
      "#DB2777", // Pink
      "#84CC16", // Lime
      "#0EA5E9", // Sky
      "#FB7185", // Rose
      "#A3E635", // Lime-light
      "#F97316", // Orange
      "#34D399", // Emerald-light
    ];

    startups.forEach(startup => {
      const category = startup.categoryType || startup.industry || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        let startups: any[] = [];

        // If role is founder, fetch founder-specific startups
        if (userRole === "founder" && userId) {
          const response = await startupsApi.getByFounder(userId);
          if (response.success && response.data) {
            startups = response.data;
          }
        } else {
          // For investors or unknown roles, fallback to all startups
          const response = await startupsApi.getAll({ limit: 100 });
          if (response.success && response.data) {
            startups = response.data;
          }
        }

        setMonthlyData(generateMonthlyData(startups));
        setCategoryData(generateCategoryData(startups));
      } catch (error) {
        console.error('Error fetching growth data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Growth Trend Chart */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Growth Overview
            </h3>
            <p className="text-sm text-muted-foreground">Last 6 months performance</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(220 70% 50%)" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(220 70% 50%)" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                labelStyle={{ color: "hsl(var(--card-foreground))" }}
              />
              <Area
                type="monotone"
                dataKey="followers"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFollowers)"
                name="Followers"
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="hsl(220 70% 50%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
                name="Views"
                yAxisId="views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Startup Categories
            </h3>
            <p className="text-sm text-muted-foreground">Distribution by industry</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-card-foreground truncate">{item.name}</span>
              <span className="text-muted-foreground">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}