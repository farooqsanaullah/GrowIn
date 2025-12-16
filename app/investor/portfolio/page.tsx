"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Building2, TrendingUp, DollarSign, BarChart3, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { investmentsApi } from "@/lib/api/investments";
import type { Investment, PortfolioStats } from "@/lib/types/api";

export default function PortfolioPage() {
  const { data: session } = useSession();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated and has an ID
      if (!session?.user?.id) {
        setError("User not authenticated");
        return;
      }

      const userId = session.user.id;

      // Pass userId as first parameter to both functions
      const [portfolioResponse, statsResponse] = await Promise.all([
        investmentsApi.getPortfolio(userId),
        investmentsApi.getPortfolioStats(userId),
      ]);
    

      if (portfolioResponse.success && portfolioResponse.data) {
        setInvestments(portfolioResponse.data);
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch portfolio data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchPortfolioData();
    } else {
      setLoading(false);
    }
  }, [session?.user?.id]);

  if (!session?.user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view your portfolio</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-72 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                <div className="space-y-2 w-full">
                  <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center p-4 bg-muted/30 rounded-lg border border-border/50"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 w-56 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-80 bg-muted rounded animate-pulse" />
                      <div className="flex items-center space-x-4">
                        <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                  <div className="h-8 w-28 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Portfolio</h1>
            <p className="text-muted-foreground">
              Track and manage your investment portfolio
            </p>
          </div>
        </div>

        <div className="text-center py-16">
          <Building2 className="h-16 w-16 mx-auto mb-6 text-destructive" />
          <h2 className="text-2xl font-bold mb-4">Error loading portfolio</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={fetchPortfolioData}>Try Again</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">
            Track and manage your investment portfolio
          </p>
        </div>
        <Button asChild>
          <Link href="/investor/discover">
            <Plus className="h-4 w-4 mr-2" />
            Discover Startups
          </Link>
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">Total Invested</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalInvestments}</p>
                <p className="text-xs text-muted-foreground">Total Investments</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.portfolioValue)}</p>
                <p className="text-xs text-muted-foreground">Portfolio Value</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.activeInvestments}</p>
                <p className="text-xs text-muted-foreground">Active Investments</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card className="p-6">
        {investments.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-4">No investments yet</h2>
            <p className="text-muted-foreground mb-6">
              Start building your portfolio by discovering and investing in promising startups.
            </p>
            <Link href="/investor/discover">
              <Button>Discover Startups</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Investments</h3>
            <div className="space-y-4">
              {investments.map((investment) => (
                <div
                  key={investment._id}
                  className="flex items-center p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                      {investment.startup?.profilePic ? (
                        <img
                          src={investment.startup.profilePic}
                          alt={investment.startup.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-primary" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-card-foreground">
                          {investment.startup?.title || "Unknown Startup"}
                        </h4>
                        <Badge className={getStatusColor(investment.status)}>
                          {investment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {investment.startup?.description || "No description available"}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Invested: {formatCurrency(investment.amount)}</span>
                        {investment.equity && <span>Equity: {investment.equity}%</span>}
                        <span>Date: {new Date(investment.investmentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/startup/${investment.startupId}`}>
                        View Startup
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
