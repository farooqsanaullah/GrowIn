"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  User,
  Building2,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

const adminSidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Investors",
    href: "/admin/investors",
    icon: Users,
  },
  {
    title: "Founders",
    href: "/admin/founders",
    icon: User,
  },
  {
    title: "Startups",
    href: "/admin/startups",
    icon: Building2,
  },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo / Top */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <img src="/logo.png" alt="GrowIn Logo" className="h-30 w-auto" />
            </Link>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleSidebar}
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {adminSidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive
                        ? "text-sidebar-primary-foreground"
                        : "text-sidebar-foreground"
                    )}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-sidebar-border p-3">
            <Button
              variant="ghost"
              className="cursor-pointer w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar toggle button for small screens */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 lg:hidden bg-background/80 backdrop-blur-sm border-border"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
