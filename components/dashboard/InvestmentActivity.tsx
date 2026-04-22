"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, Target } from "lucide-react";

interface InvestmentActivity {
  id: string;
  type: "investment" | "return" | "milestone" | "update";
  startup: string;
  description: string;
  amount?: number;
  date: string;
  status?: "positive" | "neutral" | "negative";
}

export function InvestmentActivity() {
  const [activities, setActivities] = useState<InvestmentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {

        const mockActivities: InvestmentActivity[] = [
          {
            id: "1",
            type: "return",
            startup: "HealthAI",
            description: "Quarterly return payment received",
            amount: 2400,
            date: "2024-11-20",
            status: "positive",
          },
          {
            id: "2",
            type: "milestone",
            startup: "EcoTech Solutions",
            description: "Reached 1M users milestone",
            date: "2024-11-18",
            status: "positive",
          },
          {
            id: "3",
            type: "investment",
            startup: "FoodieConnect",
            description: "Initial investment completed",
            amount: 15000,
            date: "2024-11-15",
            status: "neutral",
          },
          {
            id: "4",
            type: "update",
            startup: "EduPlatform",
            description: "Monthly progress report published",
            date: "2024-11-10",
            status: "neutral",
          },
          {
            id: "5",
            type: "return",
            startup: "EcoTech Solutions",
            description: "Monthly dividends distributed",
            amount: 850,
            date: "2024-11-05",
            status: "positive",
          },
        ];

        setActivities(mockActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-3 p-3">
                <div className="h-10 w-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case "investment":
        return <DollarSign className="h-4 w-4" />;
      case "return":
        return <TrendingUp className="h-4 w-4" />;
      case "milestone":
        return <Target className="h-4 w-4" />;
      case "update":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string, status?: string) => {
    if (status === "positive") return "text-green-600 bg-green-50";
    if (status === "negative") return "text-red-600 bg-red-50";
    
    switch (type) {
      case "investment":
        return "text-blue-600 bg-blue-50";
      case "return":
        return "text-green-600 bg-green-50";
      case "milestone":
        return "text-purple-600 bg-purple-50";
      case "update":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${getActivityColor(activity.type, activity.status)}`}>
              {getActivityIcon(activity.type, activity.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-semibold text-foreground">
                  {activity.startup}
                </p>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {activity.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                
                {activity.amount && (
                  <span className={`text-sm font-semibold ${
                    activity.type === "return" ? "text-green-600" : "text-foreground"
                  }`}>
                    {activity.type === "return" ? "+" : "-"}${activity.amount.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View all activity →
        </button>
      </div>
    </Card>
  );
}