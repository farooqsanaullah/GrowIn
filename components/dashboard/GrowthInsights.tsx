"use client";

export function GrowthInsights() {
  return (
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
  );
}