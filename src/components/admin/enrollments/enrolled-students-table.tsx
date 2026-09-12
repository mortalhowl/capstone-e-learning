"use client";

import * as React from "react";
import {
  Search,
  UserCheck,
  Users,
  GraduationCap,
  UserX,
  Loader2,
  AlertTriangle,
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

interface EnrolledStudentsTableProps {
  students?: Student[];
  isLoading: boolean;
  isFetching: boolean;
  courseName: string;
  courseId: string;
  onUnenroll?: (taiKhoan: string) => Promise<void>;
  isUnenrolling?: boolean;
}

export function EnrolledStudentsTable({
  students = [],
  isLoading,
  isFetching,
  courseName,
  courseId,
  onUnenroll,
  isUnenrolling,
}: EnrolledStudentsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [studentToUnenroll, setStudentToUnenroll] = React.useState<Student | null>(null);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const filteredStudents = React.useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase();
    return students.filter(
      (s) =>
        s.hoTen?.toLowerCase().includes(term) ||
        s.taiKhoan?.toLowerCase().includes(term) ||
        s.biDanh?.toLowerCase().includes(term)
    );
  }, [students, searchTerm]);

  const handleConfirmUnenroll = async () => {
    if (!studentToUnenroll || !onUnenroll) return;
    await onUnenroll(studentToUnenroll.taiKhoan);
    setStudentToUnenroll(null);
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
              <TableHead className="text-right w-[120px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-student-${index}`}>
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

  // 2. Empty State khi khóa học chưa có học viên
  if (students.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <GraduationCap className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Chưa có học viên nào ghi danh
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Khóa học <strong>{courseName || courseId}</strong> hiện tại chưa có học viên nào tham gia.
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
            Danh sách học viên ghi danh
          </h3>
          <Badge variant="secondary" className="font-mono text-xs">
            {filteredStudents.length} / {students.length} học viên
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
              <TableHead className="w-[120px] text-right">Thao tác</TableHead>
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
              filteredStudents.map((student, index) => (
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
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
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
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-medium text-xs gap-1">
                      <UserCheck className="size-3" />
                      <span>Đã ghi danh</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {onUnenroll && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStudentToUnenroll(student)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1.5 text-xs"
                      >
                        <UserX className="size-3.5" />
                        <span>Hủy</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal xác nhận Hủy ghi danh */}
      <Dialog
        open={Boolean(studentToUnenroll)}
        onOpenChange={(open) => !open && setStudentToUnenroll(null)}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader className="gap-2">
            <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="size-5" />
            </div>
            <DialogTitle>Xác nhận hủy ghi danh?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Bạn có chắc chắn muốn hủy ghi danh học viên{" "}
              <strong className="text-foreground">
                {studentToUnenroll?.hoTen} (@{studentToUnenroll?.taiKhoan})
              </strong>{" "}
              khỏi khóa học{" "}
              <strong className="text-foreground">{courseName || courseId}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStudentToUnenroll(null)}
              disabled={isUnenrolling}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmUnenroll}
              disabled={isUnenrolling}
              className="gap-2"
            >
              {isUnenrolling && <Loader2 className="size-4 animate-spin" />}
              <span>{isUnenrolling ? "Đang hủy..." : "Xác nhận hủy"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
