"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  DollarSign,
  Target,
  Calendar,
  Download
} from "lucide-react";

interface AnalyticsData {
  portfolioValue: number;
  totalInvested: number;
  totalReturn: number;
  monthlyData: Array<{
    month: string;
    value: number;
    invested: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    value: number;
    count: number;
  }>;
  performanceMetrics: {
    bestPerformer: string;
    bestReturn: number;
    worstPerformer: string;
    worstReturn: number;
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("6m");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {

        const mockData: AnalyticsData = {
          portfolioValue: 220000,
          totalInvested: 195000,
          totalReturn: 25000,
          monthlyData: [
            { month: "May", value: 180000, invested: 165000 },
            { month: "Jun", value: 185000, invested: 175000 },
            { month: "Jul", value: 192000, invested: 180000 },
            { month: "Aug", value: 198000, invested: 185000 },
            { month: "Sep", value: 205000, invested: 190000 },
            { month: "Oct", value: 215000, invested: 195000 },
            { month: "Nov", value: 220000, invested: 195000 },
          ],
          categoryBreakdown: [
            { category: "Healthcare", value: 65000, count: 2 },
            { category: "Clean Energy", value: 45000, count: 3 },
            { category: "EdTech", value: 42000, count: 2 },
            { category: "FinTech", value: 35000, count: 2 },
            { category: "Food Tech", value: 20000, count: 1 },
            { category: "AgTech", value: 13000, count: 1 },
          ],
          performanceMetrics: {
            bestPerformer: "HealthAI",
            bestReturn: 28.5,
            worstPerformer: "FinanceFlow",
            worstReturn: -12.3,
          },
        };

        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalyticsData(mockData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeframe]);

  if (loading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const returnPercentage = (analyticsData.totalReturn / analyticsData.totalInvested) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your investment performance and trends.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Portfolio Value</p>
              <p className="text-2xl font-bold text-foreground">${analyticsData.portfolioValue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Return</p>
              <p className={`text-2xl font-bold ${analyticsData.totalReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analyticsData.totalReturn > 0 ? '+' : ''}${analyticsData.totalReturn.toLocaleString()}
              </p>
              <p className={`text-xs ${returnPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {returnPercentage > 0 ? '+' : ''}{returnPercentage.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Best Performer</p>
              <p className="text-lg font-semibold text-foreground">{analyticsData.performanceMetrics.bestPerformer}</p>
              <p className="text-xs text-green-600">+{analyticsData.performanceMetrics.bestReturn}%</p>
            </div>
            <Target className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Invested</p>
              <p className="text-2xl font-bold text-foreground">${analyticsData.totalInvested.toLocaleString()}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Portfolio Performance Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Portfolio Performance</h3>
          <div className="space-y-4">
            {analyticsData.monthlyData.map((data, index) => {
              const growth = index > 0 
                ? ((data.value - analyticsData.monthlyData[index - 1].value) / analyticsData.monthlyData[index - 1].value) * 100
                : 0;
              
              return (
                <div key={data.month} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-primary rounded-full"></div>
                    <div>
                      <p className="font-medium text-foreground">{data.month}</p>
                      <p className="text-sm text-muted-foreground">${data.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {index > 0 && (
                      <p className={`text-sm font-medium ${growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Investment by Category</h3>
          <div className="space-y-4">
            {analyticsData.categoryBreakdown.map((category) => {
              const percentage = (category.value / analyticsData.portfolioValue) * 100;
              
              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{category.category}</span>
                      <Badge variant="outline" className="text-xs">
                        {category.count} startup{category.count > 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      ${category.value.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Best Performer</span>
            </div>
            <p className="text-lg font-semibold text-green-900">{analyticsData.performanceMetrics.bestPerformer}</p>
            <p className="text-sm text-green-700">+{analyticsData.performanceMetrics.bestReturn}% return</p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Needs Attention</span>
            </div>
            <p className="text-lg font-semibold text-red-900">{analyticsData.performanceMetrics.worstPerformer}</p>
            <p className="text-sm text-red-700">{analyticsData.performanceMetrics.worstReturn}% return</p>
          </div>
        </div>
      </Card>
    </div>
  );
}