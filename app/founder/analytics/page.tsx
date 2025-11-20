"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users, 
  Building2, 
  Target,
  Calendar
} from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">Startup Performance</h2>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-card-foreground">EcoTech Solutions</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-card-foreground">1,456 views</div>
                <div className="text-xs text-success">+12%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-card-foreground">HealthTech AI</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-card-foreground">987 views</div>
                <div className="text-xs text-success">+8%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-card-foreground">FinanceFlow</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-card-foreground">2,103 views</div>
                <div className="text-xs text-success">+18%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-card-foreground">EduLearn Pro</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-card-foreground">743 views</div>
                <div className="text-xs text-destructive">-5%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">Recent Activity</h2>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3 pb-3 border-b border-border/50">
              <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">New investor viewed EcoTech Solutions</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pb-3 border-b border-border/50">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Profile featured in trending founders</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pb-3 border-b border-border/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">HealthTech AI received new rating</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pb-3 border-b border-border/50">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">FinanceFlow reached 300 followers</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-card-foreground">Monthly report generated</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground mb-6">Growth Insights</h2>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Profile Completion</span>
              <span className="text-sm font-medium text-card-foreground">85%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">Add more skills and experience to reach 100%</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Investor Interest</span>
              <span className="text-sm font-medium text-card-foreground">High</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-success h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">Your startups are getting great attention from investors</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Market Visibility</span>
              <span className="text-sm font-medium text-card-foreground">Growing</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">Consider updating your startup descriptions for better reach</p>
          </div>
        </div>
      </div>
    </div>
  );
}