import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

export default function FounderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={<TopBar />}
    >
      {children}
    </DashboardLayout>
  );
}