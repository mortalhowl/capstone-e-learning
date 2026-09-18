"use client";

import * as React from "react";
import {
  Search,
  UserPlus,
  Loader2,
  Users,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  UserCheck,
  RefreshCw,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useUnenrolledUsersByCourse, useEnrollUser } from "@/hooks/useCourses";
import type { Course, Student } from "@/schemas/course.schema";

interface CourseEnrollmentDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseEnrollmentDialog({
  course,
  open,
  onOpenChange,
}: CourseEnrollmentDialogProps) {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const [processingUser, setProcessingUser] = React.useState<string | null>(null);
  const pageSize = 10;

  const maKhoaHoc = course?.maKhoaHoc || "";

  // 1. Gọi API POST /api/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh
  const {
    data: unenrolledUsers = [],
    isLoading,
    isFetching,
    refetch,
  } = useUnenrolledUsersByCourse(maKhoaHoc, open && Boolean(maKhoaHoc));

  // 2. Hook ghi danh người dùng
  const enrollUserMutation = useEnrollUser();

  // Reset trang và từ khóa khi đổi khóa học hoặc mở modal
  React.useEffect(() => {
    if (open) {
      setSearchTerm("");
      setPage(1);
    }
  }, [open, maKhoaHoc]);

  // Reset về trang 1 khi từ khóa tìm kiếm thay đổi
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Hàm lấy 2 ký tự viết tắt đại diện cho họ tên
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Lọc danh sách người dùng theo từ khóa tìm kiếm
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

  // Tính toán phân trang
  const totalCount = filteredUsers.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedUsers = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  // Xử lý ghi danh người dùng vào khóa học
  const handleEnroll = async (taiKhoan: string) => {
    if (!maKhoaHoc) return;
    setProcessingUser(taiKhoan);
    try {
      await enrollUserMutation.mutateAsync({
        maKhoaHoc,
        taiKhoan,
      });
    } finally {
      setProcessingUser(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[780px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header Dialog */}
        <DialogHeader className="p-5 pb-3 border-b bg-card">
          <div className="flex items-center justify-between pr-6">
            <div className="space-y-1">
              <DialogTitle className="text-lg flex items-center gap-2 text-foreground font-semibold">
                <UserPlus className="size-5 text-primary shrink-0" />
                <span>Ghi danh người dùng vào khóa học</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 pt-0.5">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <BookOpen className="size-3.5 text-primary" />
                  {course?.tenKhoaHoc}
                </span>
                <Badge variant="outline" className="font-mono text-[11px] px-1.5 py-0">
                  {course?.maKhoaHoc}
                </Badge>
              </DialogDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 gap-1.5 text-xs shrink-0"
              title="Làm mới danh sách"
            >
              <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Thanh công cụ tìm kiếm */}
        <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm theo tài khoản, họ tên hoặc bí danh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-8 rounded-md border border-input bg-background text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="text-xs text-muted-foreground shrink-0 font-medium">
            Chưa ghi danh:{" "}
            <strong className="text-foreground font-semibold">
              {filteredUsers.length}
            </strong>{" "}
            / {unenrolledUsers.length} người dùng
          </div>
        </div>

        {/* Bảng danh sách người dùng chưa ghi danh */}
        <div className="flex-1 overflow-y-auto min-h-[320px] max-h-[460px]">
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-enroll-${i}`}
                  className="flex items-center justify-between p-2.5 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="size-9 rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1 max-w-sm">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
              <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <UserCheck className="size-6" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-base font-semibold text-foreground">
                  {searchTerm
                    ? "Không tìm thấy người dùng phù hợp"
                    : "Tất cả học viên đã được ghi danh"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {searchTerm
                    ? `Không có người dùng chưa ghi danh nào khớp với từ khóa "${searchTerm}".`
                    : "Hiện không còn người dùng nào trong hệ thống chưa ghi danh vào khóa học này."}
                </p>
              </div>
            </div>
          ) : (
            /* Table State */
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead className="min-w-[220px]">Người dùng</TableHead>
                  <TableHead className="min-w-[140px]">Bí danh</TableHead>
                  <TableHead className="min-w-[130px]">Trạng thái</TableHead>
                  <TableHead className="w-[120px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user, index) => {
                  const isCurrentProcessing = processingUser === user.taiKhoan;
                  const rowNumber = (page - 1) * pageSize + index + 1;
                  const displayName = user.hoTen || user.taiKhoan;

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
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                              {getInitials(displayName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5 min-w-0">
                            <div
                              className="font-medium text-sm text-foreground truncate max-w-[200px]"
                              title={displayName}
                            >
                              {displayName}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              @{user.taiKhoan}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground font-mono">
                          {user.biDanh || "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs font-normal text-muted-foreground"
                        >
                          Chưa ghi danh
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleEnroll(user.taiKhoan)}
                          disabled={
                            Boolean(processingUser) ||
                            enrollUserMutation.isPending
                          }
                          className="h-8 px-2.5 gap-1.5 text-xs bg-primary text-primary-foreground font-medium"
                          title="Ghi danh học viên này"
                        >
                          {isCurrentProcessing &&
                          enrollUserMutation.isPending ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <UserPlus className="size-3.5" />
                          )}
                          <span>Ghi danh</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Footer Phân trang */}
        {totalPages > 1 && (
          <div className="p-3 border-t bg-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>
              Hiển thị{" "}
              <strong className="text-foreground">
                {(page - 1) * pageSize + 1}
              </strong>{" "}
              -{" "}
              <strong className="text-foreground">
                {Math.min(page * pageSize, totalCount)}
              </strong>{" "}
              trong tổng số{" "}
              <strong className="text-foreground">{totalCount}</strong> người dùng
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 px-2.5 gap-1 text-xs"
              >
                <ChevronLeft className="size-3.5" />
                <span>Trước</span>
              </Button>

              <span className="text-xs font-medium px-2">
                Trang <strong className="text-foreground">{page}</strong> /{" "}
                {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="h-8 px-2.5 gap-1 text-xs"
              >
                <span>Sau</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
