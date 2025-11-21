"use client";

import { Calendar } from "lucide-react";

export function RecentActivity() {
  return (
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
  );
}