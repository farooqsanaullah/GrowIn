"use client";

import { BarChart3 } from "lucide-react";

export function StartupPerformance() {
  return (
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
  );
}