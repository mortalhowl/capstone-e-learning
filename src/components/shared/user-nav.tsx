"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { User, BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";

import type { LoginResponse } from "@/schemas/user.schema";
import { useAuthStore } from "@/stores/auth.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserNavProps {
  user: LoginResponse;
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất thành công!");
    router.push("/");
  };

  const isTeacher = user.maLoaiNguoiDung === "GV";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-transform active:scale-95 cursor-pointer">
        <Avatar className="size-9 border border-border/80 shadow-xs">
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs tracking-wider">
            {getInitials(user.hoTen)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg border-border/60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal px-2 py-1.5">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold leading-none text-foreground truncate">
                  {user.hoTen}
                </p>
                <Badge
                  variant={isTeacher ? "default" : "secondary"}
                  className="text-[10px] px-1.5 py-0 h-4 font-medium shrink-0"
                >
                  {isTeacher ? "Giảng viên" : "Học viên"}
                </Badge>
              </div>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2.5 px-2 py-1.5 text-sm cursor-pointer"
          >
            <User className="size-4 text-muted-foreground" />
            <span>Thông tin cá nhân</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/profile/my-courses")}
            className="flex items-center gap-2.5 px-2 py-1.5 text-sm cursor-pointer"
          >
            <BookOpen className="size-4 text-muted-foreground" />
            <span>Khóa học của tôi</span>
          </DropdownMenuItem>

          {isTeacher && (
            <DropdownMenuItem
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2.5 px-2 py-1.5 text-sm cursor-pointer text-primary focus:text-primary focus:bg-primary/10"
            >
              <LayoutDashboard className="size-4" />
              <span className="font-medium">Trang quản trị</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-2.5 px-2 py-1.5 text-sm cursor-pointer"
        >
          <LogOut className="size-4" />
          <span className="font-medium">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
