"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  GraduationCap,
  Home,
  BookOpen,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import type { LoginResponse } from "@/schemas/user.schema";
import { useAuthStore } from "@/stores/auth.store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user: LoginResponse | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    toast.success("Đã đăng xuất thành công!");
    router.push("/");
  };

  const navLinks = [
    { label: "Trang chủ", href: "/", icon: Home },
    { label: "Khóa học", href: "/courses", icon: BookOpen },
  ];

  const isTeacher = user?.maLoaiNguoiDung === "GV";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden size-9 cursor-pointer")}>
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0 flex flex-col justify-between">
        <div className="flex flex-col">
          <SheetHeader className="p-5 border-b border-border/40 text-left">
            <SheetTitle>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 group"
              >
                <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 group-hover:bg-primary/90 transition-colors">
                  <GraduationCap className="size-5" />
                </div>
                <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-foreground">
                  <span>E-Learning</span>
                </div>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border/40 bg-muted/20">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-background border border-border/50 shadow-xs">
                <Avatar className="size-10 shrink-0 border border-border/60">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {getInitials(user.hoTen)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {user.hoTen}
                    </p>
                    <Badge
                      variant={isTeacher ? "default" : "secondary"}
                      className="text-[9px] px-1.5 py-0 h-4 shrink-0 font-medium"
                    >
                      {isTeacher ? "GV" : "HV"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <User className="size-4" />
                  <span>Thông tin cá nhân</span>
                </Link>

                <Link
                  href="/profile/my-courses"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <BookOpen className="size-4" />
                  <span>Khóa học của tôi</span>
                </Link>

                {isTeacher && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <LayoutDashboard className="size-4" />
                    <span>Trang quản trị</span>
                  </Link>
                )}
              </div>

              <Separator />

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-9 px-3"
              >
                <LogOut className="size-4 mr-2" />
                <span>Đăng xuất</span>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }), "w-full h-10")}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "default" }), "w-full h-10")}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
