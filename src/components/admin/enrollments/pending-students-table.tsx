"use client";

import * as React from "react";
import {
  Search,
  Clock,
  UserCheck,
  UserX,
  Loader2,
  AlertTriangle,
  GraduationCap,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Student } from "@/schemas/course.schema";

interface PendingStudentsTableProps {
  pendingStudents?: Student[];
  isLoading: boolean;
  isFetching: boolean;
  courseName: string;
  courseId: string;
  onApprove: (taiKhoan: string) => Promise<void>;
  onReject: (taiKhoan: string) => Promise<void>;
  isApproving?: boolean;
  isRejecting?: boolean;
}

export function PendingStudentsTable({
  pendingStudents = [],
  isLoading,
  isFetching,
  courseName,
  courseId,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: PendingStudentsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [studentToReject, setStudentToReject] = React.useState<Student | null>(null);
  const [processingUser, setProcessingUser] = React.useState<string | null>(null);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const filteredStudents = React.useMemo(() => {
    if (!searchTerm.trim()) return pendingStudents;
    const term = searchTerm.toLowerCase();
    return pendingStudents.filter(
      (s) =>
        s.hoTen?.toLowerCase().includes(term) ||
        s.taiKhoan?.toLowerCase().includes(term) ||
        s.biDanh?.toLowerCase().includes(term)
    );
  }, [pendingStudents, searchTerm]);

  const handleApproveClick = async (taiKhoan: string) => {
    setProcessingUser(taiKhoan);
    try {
      await onApprove(taiKhoan);
    } finally {
      setProcessingUser(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!studentToReject) return;
    setProcessingUser(studentToReject.taiKhoan);
    try {
      await onReject(studentToReject.taiKhoan);
      setStudentToReject(null);
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
              <TableHead className="w-[300px]">Học viên</TableHead>
              <TableHead>Bí danh</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right w-[160px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={`skeleton-pending-${index}`}>
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

  // 2. Empty State khi không có học viên nào chờ duyệt
  if (pendingStudents.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <UserCheck className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Không có yêu cầu chờ duyệt
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Toàn bộ học viên đăng ký khóa học <strong>{courseName || courseId}</strong> đã được xử lý xong.
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
            Danh sách học viên chờ xét duyệt
          </h3>
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-mono text-xs">
            {filteredStudents.length} / {pendingStudents.length} chờ duyệt
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
              <TableHead className="min-w-[250px]">Học viên</TableHead>
              <TableHead className="min-w-[160px]">Bí danh</TableHead>
              <TableHead className="min-w-[140px]">Trạng thái</TableHead>
              <TableHead className="w-[180px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  Không tìm thấy học viên nào khớp với từ khóa &ldquo;{searchTerm}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, index) => {
                const isCurrentProcessing = processingUser === student.taiKhoan;

                return (
                  <TableRow
                    key={student.taiKhoan}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border shrink-0">
                          <AvatarFallback className="bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold text-xs">
                            {getInitials(student.hoTen)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5 min-w-0">
                          <div
                            className="font-medium text-sm text-foreground truncate"
                            title={student.hoTen}
                          >
                            {student.hoTen}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            @{student.taiKhoan}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {student.biDanh || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-medium text-xs gap-1">
                        <Clock className="size-3" />
                        <span>Chờ duyệt</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Nút Duyệt (Approve) */}
                        <Button
                          size="sm"
                          onClick={() => handleApproveClick(student.taiKhoan)}
                          disabled={Boolean(processingUser) || isApproving}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-2.5 gap-1 text-xs"
                        >
                          {isCurrentProcessing && isApproving ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <UserCheck className="size-3.5" />
                          )}
                          <span>Duyệt</span>
                        </Button>

                        {/* Nút Từ chối (Reject) */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStudentToReject(student)}
                          disabled={Boolean(processingUser) || isRejecting}
                          className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-8 px-2.5 gap-1 text-xs"
                        >
                          {isCurrentProcessing && isRejecting ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <UserX className="size-3.5" />
                          )}
                          <span>Từ chối</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal xác nhận Từ chối duyệt */}
      <Dialog
        open={Boolean(studentToReject)}
        onOpenChange={(open) => !open && setStudentToReject(null)}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader className="gap-2">
            <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="size-5" />
            </div>
            <DialogTitle>Xác nhận từ chối ghi danh?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn từ chối yêu cầu tham gia khóa học của học viên{" "}
              <strong className="text-foreground">
                {studentToReject?.hoTen} (@{studentToReject?.taiKhoan})
              </strong>{" "}
              cho khóa học{" "}
              <strong className="text-foreground">{courseName || courseId}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStudentToReject(null)}
              disabled={isRejecting}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={isRejecting}
              className="gap-2"
            >
              {isRejecting && <Loader2 className="size-4 animate-spin" />}
              <span>{isRejecting ? "Đang xử lý..." : "Xác nhận từ chối"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
