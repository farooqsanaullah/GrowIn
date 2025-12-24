"use client";

import { Bell, Search, User, LogOut, KeyRound } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import { useCallback, useState } from "react";

interface TopBarProps {
  title?: string;
  description?: string;
}

export function TopBar({ title = "Dashboard", description }: TopBarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const token = session?.user.id;

  const handleLogout = () => {
    signOut({
      callbackUrl: "/signin",
    });
  };

  const handleChangePassword = () => {
    setIsOpen(true);
  };
  
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [router]);

  return (
    <header className="h-16 bg-background border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <div className="hidden sm:block">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-10 bg-muted/50 border-border"
          />
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center">
            <span className="sr-only">3 notifications</span>
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleChangePassword}>
              <KeyRound className="mr-2 h-4 w-4" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ChangePasswordModal
        isOpen={isOpen}
        onClose={handleClose}
        isForgotPasswordFlow={false}
        token={token}
      />
    </header>
  );
}