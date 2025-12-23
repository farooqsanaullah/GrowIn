import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import { TopBar } from "@/components/dashboard/TopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      sidebar={<AdminSidebar />}
      topbar={<TopBar />}
    >
      {children}
    </DashboardLayout>
  );
}
