"use client";

import * as React from "react";
import {
  Search,
  UserPlus,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  UserCheck,
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
import type { Student } from "@/schemas/course.schema";

interface UnenrolledStudentsTableProps {
  unenrolledUsers?: Student[];
  isLoading: boolean;
  isFetching: boolean;
  courseName: string;
  courseId: string;
  onEnroll: (taiKhoan: string) => Promise<void>;
  isEnrolling?: boolean;
}

export function UnenrolledStudentsTable({
  unenrolledUsers = [],
  isLoading,
  isFetching,
  courseName,
  courseId,
  onEnroll,
  isEnrolling,
}: UnenrolledStudentsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [processingUser, setProcessingUser] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const filteredUsers = React.useMemo(() => {
    if (!searchTerm.trim()) return unenrolledUsers;
    const term = searchTerm.toLowerCase();
    return unenrolledUsers.filter(
      (s) =>
        s.hoTen?.toLowerCase().includes(term) ||
        s.taiKhoan?.toLowerCase().includes(term) ||
        s.biDanh?.toLowerCase().includes(term)
    );
  }, [unenrolledUsers, searchTerm]);

  // Reset về page 1 khi tìm kiếm
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const handleEnrollClick = async (taiKhoan: string) => {
    setProcessingUser(taiKhoan);
    try {
      await onEnroll(taiKhoan);
    } finally {
      setProcessingUser(null);
    }
  };

  // 1. Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-8 w-60" />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-[300px]">Người dùng</TableHead>
              <TableHead>Bí danh</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right w-[140px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-unenrolled-${index}`}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
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

  // 2. Empty State khi tất cả học viên đã ghi danh
  if (unenrolledUsers.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <UserCheck className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Tất cả học viên đã ghi danh
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Không còn người dùng nào trong hệ thống chưa tham gia khóa học{" "}
            <strong>{courseName || courseId}</strong>.
          </p>
        </div>
      </div>
    );
  }

  // 3. Normal Table State
  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-xs">
      {/* Header công cụ tìm kiếm */}
      <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground">
            Danh sách người dùng chưa ghi danh
          </h3>
          <Badge variant="outline" className="font-mono text-xs">
            {filteredUsers.length} / {unenrolledUsers.length} người dùng
          </Badge>
          {isFetching && (
            <span className="text-xs text-muted-foreground animate-pulse">
              (Đang đồng bộ...)
            </span>
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo họ tên hoặc tài khoản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-md border border-input bg-background text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="min-w-[250px]">Người dùng</TableHead>
              <TableHead className="min-w-[160px]">Bí danh</TableHead>
              <TableHead className="min-w-[140px]">Trạng thái</TableHead>
              <TableHead className="w-[140px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  Không tìm thấy người dùng nào khớp với từ khóa &ldquo;{searchTerm}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user, index) => {
                const isCurrentProcessing = processingUser === user.taiKhoan;
                const rowNumber = (page - 1) * pageSize + index + 1;

                return (
                  <TableRow
                    key={user.taiKhoan}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                      {rowNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border shrink-0">
                          <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-xs">
                            {getInitials(user.hoTen)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5 min-w-0">
                          <div
                            className="font-medium text-sm text-foreground truncate"
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
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.biDanh || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                        Chưa ghi danh
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleEnrollClick(user.taiKhoan)}
                        disabled={Boolean(processingUser) || isEnrolling}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3 gap-1.5 text-xs font-medium"
                      >
                        {isCurrentProcessing && isEnrolling ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <UserPlus className="size-3.5" />
                        )}
                        <span>Ghi danh</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang danh sách người dùng */}
      {totalPages > 1 && (
        <div className="p-3 border-t bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Hiển thị trang <strong>{page}</strong> / <strong>{totalPages}</strong> ({filteredUsers.length} người dùng)
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="h-7 px-2 gap-1 text-xs"
            >
              <ChevronLeft className="size-3.5" />
              <span>Trước</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="h-7 px-2 gap-1 text-xs"
            >
              <span>Sau</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
