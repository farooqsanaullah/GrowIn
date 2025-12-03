"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Building2 } from "lucide-react";
import Link from "next/link";

interface PortfolioStartup {
  id: string;
  name: string;
  description: string;
  category: string;
  investmentAmount: number;
  currentValue: number;
  investmentDate: string;
  status: "growing" | "stable" | "declining";
  logo?: string;
}

export function PortfolioOverview() {
  const { data: session } = useSession();
  const [portfolioStartups, setPortfolioStartups] = useState<PortfolioStartup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const queryParams = new URLSearchParams({
          userId: session.user.id,
          limit: '6' // Only show first 6 for overview
        });

        const response = await fetch(`/api/investor/portfolio?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch portfolio');
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.portfolio)) {
          const transformedPortfolio = data.portfolio.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            category: item.category,
            investmentAmount: item.investmentAmount,
            currentValue: item.currentValue,
            investmentDate: item.investmentDate,
            status: item.status,
            logo: item.logo
          }));
          setPortfolioStartups(transformedPortfolio);
        } else {
          setPortfolioStartups([]);
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setPortfolioStartups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [session]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-12 w-12 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Empty state when no session
  if (!session?.user) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Portfolio Overview</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please sign in to view your portfolio.</p>
        </div>
      </Card>
    );
  }

  // Empty state when no investments
  if (portfolioStartups.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Portfolio Overview</h2>
          <Link href="/investor/discover">
            <Button variant="outline" size="sm">
              Discover Startups
            </Button>
          </Link>
        </div>
        <div className="text-center py-8">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">No investments yet</p>
          <p className="text-sm text-muted-foreground">Start building your portfolio by investing in startups.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Portfolio Overview</h2>
        <Link href="/investor/portfolio">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {portfolioStartups.slice(0, 4).map((startup) => {
          const returnAmount = startup.currentValue - startup.investmentAmount;
          const returnPercentage = (returnAmount / startup.investmentAmount) * 100;
          
          return (
            <div
              key={startup.id}
              className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <div className="text-primary font-semibold text-sm">
                  {startup.name.substring(0, 2)}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground">{startup.name}</h3>
                  <Badge variant={startup.status === "growing" ? "default" : startup.status === "stable" ? "secondary" : "destructive"}>
                    {startup.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {startup.description}
                </p>
                <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Invested {new Date(startup.investmentDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">
                    ${startup.currentValue.toLocaleString()}
                  </span>
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  returnAmount > 0 ? 'text-green-600' : returnAmount < 0 ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {returnAmount > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : returnAmount < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  <span>
                    {returnAmount > 0 ? '+' : ''}${returnAmount.toLocaleString()} ({returnPercentage > 0 ? '+' : ''}{returnPercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}