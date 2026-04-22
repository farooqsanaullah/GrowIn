import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvestorSidebar } from "@/components/dashboard/InvestorSidebar";
import { TopBar } from "@/components/dashboard/TopBar";

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebar={<InvestorSidebar />}
      topbar={<TopBar />}
    >
      {children}
    </DashboardLayout>
  );
}