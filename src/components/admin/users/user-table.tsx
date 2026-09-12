"use client";

import * as React from "react";
import {
  Mail,
  Phone,
  ShieldCheck,
  GraduationCap,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  BookOpen,
  UserCheck,
  Users as UsersIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserItem } from "@/schemas/user.schema";

interface UserTableProps {
  users?: UserItem[];
  isLoading: boolean;
  isFetching: boolean;
  onResetSearch?: () => void;
  isFiltered?: boolean;
  onEditUser?: (user: UserItem) => void;
  onDeleteUser?: (user: UserItem) => void;
}

export function UserTable({
  users = [],
  isLoading,
  isFetching,
  onResetSearch,
  isFiltered,
  onEditUser,
  onDeleteUser,
}: UserTableProps) {
  // Hàm lấy 2 chữ cái đầu của họ tên để hiển thị Avatar Fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // 1. Loading State (Hiển thị Skeleton)
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[280px]">Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead className="w-[70px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={`skeleton-user-${index}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="size-8 rounded-md ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // 2. Empty State (Không tìm thấy kết quả)
  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <UsersIcon className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium">Không tìm thấy người dùng nào</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {isFiltered
              ? "Không có tài khoản nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại. Vui lòng thử lại."
              : "Hiện tại hệ thống chưa có dữ liệu người dùng."}
          </p>
        </div>
        {isFiltered && onResetSearch && (
          <Button variant="outline" size="sm" onClick={onResetSearch} className="mt-2">
            Xóa bộ lọc tìm kiếm
          </Button>
        )}
      </div>
    );
  }

  // 3. Normal Table State
  return (
    <div className="relative rounded-lg border bg-card overflow-hidden shadow-xs">
      {/* Loading bar khi background fetching */}
      {isFetching && !isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse z-10" />
      )}

      <div className="overflow-x-auto">
        <Table className={isFetching && !isLoading ? "opacity-75 transition-opacity" : ""}>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="min-w-[240px]">Người dùng</TableHead>
              <TableHead className="min-w-[220px]">Email</TableHead>
              <TableHead className="min-w-[150px]">Số điện thoại</TableHead>
              <TableHead className="min-w-[150px]">Vai trò</TableHead>
              <TableHead className="w-[70px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const phone = user.soDt || user.soDT || "—";
              const isTeacher = user.maLoaiNguoiDung === "GV";

              return (
                <TableRow key={user.taiKhoan} className="hover:bg-muted/40 transition-colors">
                  {/* Cột 1: Thông tin người dùng */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 border shrink-0">
                        <AvatarFallback className={isTeacher ? "bg-primary/15 text-primary font-semibold text-xs" : "bg-muted text-muted-foreground font-semibold text-xs"}>
                          {getInitials(user.hoTen)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5 min-w-0">
                        <div
                          className="font-medium text-sm text-foreground line-clamp-1"
                          title={user.hoTen}
                        >
                          {user.hoTen}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          @{user.taiKhoan}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 2: Email */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="size-3.5 shrink-0" />
                      <span className="truncate max-w-[220px]" title={user.email}>
                        {user.email}
                      </span>
                    </div>
                  </TableCell>

                  {/* Cột 3: Số điện thoại */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="size-3.5 shrink-0" />
                      <span>{phone}</span>
                    </div>
                  </TableCell>

                  {/* Cột 4: Vai trò (GV vs HV) */}
                  <TableCell>
                    {isTeacher ? (
                      <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-medium text-xs gap-1">
                        <ShieldCheck className="size-3" />
                        <span>Giáo vụ (Admin)</span>
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="font-normal text-xs gap-1">
                        <GraduationCap className="size-3 text-muted-foreground" />
                        <span>Học viên</span>
                      </Badge>
                    )}
                  </TableCell>

                  {/* Cột 5: Thao tác */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-8 p-0"
                            title="Tùy chọn"
                          >
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Tùy chọn</span>
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <ExternalLink className="size-4" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <BookOpen className="size-4" />
                          <span>Ghi danh khóa học</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer"
                          onClick={() => onEditUser?.(user)}
                        >
                          <Edit className="size-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                          onClick={() => onDeleteUser?.(user)}
                        >
                          <Trash2 className="size-4" />
                          <span>Xóa tài khoản</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
