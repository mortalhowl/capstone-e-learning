"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth.store";
import { ToggleTheme } from "@/components/shared/toggle-theme";

// ─── Breadcrumb helpers ─────────────────────────────────────────────
// Tạo breadcrumb từ pathname để user biết mình đang ở đâu

const LABEL_MAP: Record<string, string> = {
  admin: "Dashboard",
  courses: "Courses",
  categories: "Categories",
  chapters: "Chapters",
  lessons: "Lessons",
  reviews: "Reviews",
  users: "Users",
  students: "Students",
  instructors: "Instructors",
  enrollments: "Enrollments",
  progress: "Learning Progress",
  payments: "Payments",
  transactions: "Transactions",
  orders: "Orders",
  refunds: "Refunds",
  communication: "Communication",
  announcements: "Announcements",
  notifications: "Notifications",
  comments: "Comments",
  support: "Support",
  tickets: "Support Tickets",
  reports: "Reports",
  revenue: "Revenue",
  roles: "Roles & Permissions",
  settings: "Settings",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, index) => ({
    label: LABEL_MAP[segment] || segment,
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));
}

// ─── Admin Header Component ────────────────────────────────────────

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const breadcrumbs = getBreadcrumbs(pathname);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      {/* Sidebar toggle + Breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <nav className="flex items-center gap-1 text-xs sm:text-sm min-w-0">
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.href}>
              {crumb.href !== breadcrumbs[0]?.href && (
                <ChevronRight className="size-3 text-muted-foreground shrink-0 hidden sm:inline-block" />
              )}
              {crumb.isLast ? (
                <span className="font-medium truncate text-foreground">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-foreground transition-colors truncate hidden sm:inline-block"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right side: Theme toggle + User dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

        <ToggleTheme />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {user?.hoTen?.charAt(0)?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium truncate">{user?.hoTen}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/" />}>
              Về trang chủ
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="size-4 mr-2" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
