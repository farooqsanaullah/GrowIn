"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DollarSign, 
  Calendar, 
  Search, 
  Filter,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface PortfolioItem {
  id: string;
  name: string;
  description: string;
  category: string;
  investmentAmount: number;
  currentValue: number;
  investmentDate: string;
  lastUpdate: string;
  status: "growing" | "stable" | "declining";
  logo?: string;
  founderName: string;
  stage: string;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const mockPortfolio: PortfolioItem[] = [
          {
            id: "1",
            name: "EcoTech Solutions",
            description: "Renewable energy solutions for small businesses with smart monitoring",
            category: "Clean Energy",
            investmentAmount: 25000,
            currentValue: 32000,
            investmentDate: "2024-01-15",
            lastUpdate: "2024-11-20",
            status: "growing",
            founderName: "Sarah Johnson",
            stage: "Series A",
          },
          {
            id: "2",
            name: "HealthAI",
            description: "AI-powered health diagnostics platform for early disease detection",
            category: "Healthcare",
            investmentAmount: 50000,
            currentValue: 58000,
            investmentDate: "2024-03-20",
            lastUpdate: "2024-11-22",
            status: "growing",
            founderName: "Dr. Michael Chen",
            stage: "Seed",
          },
          {
            id: "3",
            name: "FoodieConnect",
            description: "Platform connecting local restaurants with customers for sustainable dining",
            category: "Food Tech",
            investmentAmount: 15000,
            currentValue: 14500,
            investmentDate: "2024-06-10",
            lastUpdate: "2024-11-18",
            status: "stable",
            founderName: "Maria Rodriguez",
            stage: "Pre-Seed",
          },
          {
            id: "4",
            name: "EduPlatform",
            description: "Online learning platform for technical skills with AI-powered personalization",
            category: "EdTech",
            investmentAmount: 35000,
            currentValue: 42000,
            investmentDate: "2024-02-28",
            lastUpdate: "2024-11-21",
            status: "growing",
            founderName: "Alex Thompson",
            stage: "Series A",
          },
          {
            id: "5",
            name: "FinanceFlow",
            description: "Personal finance management app with smart budgeting and investment advice",
            category: "FinTech",
            investmentAmount: 20000,
            currentValue: 18000,
            investmentDate: "2024-08-05",
            lastUpdate: "2024-11-19",
            status: "declining",
            founderName: "James Wilson",
            stage: "Seed",
          },
          {
            id: "6",
            name: "AgriSmart",
            description: "IoT solutions for precision agriculture and crop monitoring",
            category: "AgTech",
            investmentAmount: 30000,
            currentValue: 35000,
            investmentDate: "2024-04-12",
            lastUpdate: "2024-11-23",
            status: "growing",
            founderName: "Lisa Park",
            stage: "Series A",
          }
        ];

        setPortfolio(mockPortfolio);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const categories = [...new Set(portfolio.map(item => item.category))];

  const filteredPortfolio = portfolio.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedPortfolio = [...filteredPortfolio].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      case "performance":
        const aReturn = ((a.currentValue - a.investmentAmount) / a.investmentAmount) * 100;
        const bReturn = ((b.currentValue - b.investmentAmount) / b.investmentAmount) * 100;
        return bReturn - aReturn;
      case "investment":
        return b.investmentAmount - a.investmentAmount;
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/4"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-muted rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Investment Portfolio</h1>
        <p className="text-muted-foreground">
          Manage and track all your startup investments in one place.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search startups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent Updates</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="investment">Investment Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedPortfolio.map((item) => {
          const returnAmount = item.currentValue - item.investmentAmount;
          const returnPercentage = (returnAmount / item.investmentAmount) * 100;
          
          return (
            <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {item.stage}
                      </Badge>
                    </div>
                    <Badge 
                      variant={item.status === "growing" ? "default" : 
                               item.status === "stable" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <Link href={`/startup/${item.id}`}>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Investment</span>
                    <span className="text-sm font-medium">${item.investmentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Value</span>
                    <span className="text-sm font-medium">${item.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Return</span>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
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

                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Founder: {item.founderName}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Last update: {new Date(item.lastUpdate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sortedPortfolio.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No startups found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}