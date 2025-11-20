import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
}

export function DashboardLayout({ children, sidebar, topbar }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {sidebar}
        
        <div className="flex flex-1 flex-col overflow-hidden">
          {topbar}
          
          <main className="flex-1 overflow-y-auto bg-muted/30 p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}