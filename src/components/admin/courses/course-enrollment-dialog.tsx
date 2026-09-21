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
  UserX,
  RefreshCw,
  X,
  GraduationCap,
  Clock,
  Check,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  useUnenrolledUsersByCourse,
  useStudentsByCourse,
  usePendingStudentsByCourse,
  useEnrollUser,
  useUnenroll,
  useApproveEnrollment,
  useRejectEnrollment,
} from "@/hooks/useCourses";
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
  const maKhoaHoc = course?.maKhoaHoc || "";

  // Quản lý Tab: "enrolled" (Đã ghi danh), "pending" (Chờ xét duyệt), "unenrolled" (Chưa ghi danh)
  const [activeTab, setActiveTab] = React.useState<string>("enrolled");

  // State tìm kiếm và phân trang riêng cho từng tab
  const [searchEnrolled, setSearchEnrolled] = React.useState<string>("");
  const [pageEnrolled, setPageEnrolled] = React.useState<number>(1);

  const [searchPending, setSearchPending] = React.useState<string>("");
  const [pagePending, setPagePending] = React.useState<number>(1);

  const [searchUnenrolled, setSearchUnenrolled] = React.useState<string>("");
  const [pageUnenrolled, setPageUnenrolled] = React.useState<number>(1);

  // Học viên đang chờ xác thực ghi danh (Modal xác nhận 13.1.4)
  const [userToConfirmEnroll, setUserToConfirmEnroll] = React.useState<Student | null>(null);

  // User đang thực hiện thao tác (để hiển thị loading spinner theo dòng)
  const [processingUser, setProcessingUser] = React.useState<string | null>(null);
  const pageSize = 10;

  // 1. API 13.1.2: LayDanhSachHocVienKhoaHoc (Đã ghi danh)
  const {
    data: enrolledStudents = [],
    isLoading: isLoadingEnrolled,
    isFetching: isFetchingEnrolled,
    refetch: refetchEnrolled,
  } = useStudentsByCourse(maKhoaHoc, open && Boolean(maKhoaHoc));

  // 2. API 13.1.3: LayDanhSachHocVienChoXetDuyet (Chờ xét duyệt)
  const {
    data: pendingStudents = [],
    isLoading: isLoadingPending,
    isFetching: isFetchingPending,
    refetch: refetchPending,
  } = usePendingStudentsByCourse(maKhoaHoc, open && Boolean(maKhoaHoc));

  // 3. API 13.1.1: LayDanhSachNguoiDungChuaGhiDanh (Chưa ghi danh)
  const {
    data: unenrolledUsers = [],
    isLoading: isLoadingUnenrolled,
    isFetching: isFetchingUnenrolled,
    refetch: refetchUnenrolled,
  } = useUnenrolledUsersByCourse(maKhoaHoc, open && Boolean(maKhoaHoc));

  // Hooks Mutation
  const enrollUserMutation = useEnrollUser();
  const unenrollMutation = useUnenroll();
  const approveMutation = useApproveEnrollment();
  const rejectMutation = useRejectEnrollment();

  // Hàm đóng dialog và dọn dẹp state
  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSearchEnrolled("");
      setSearchPending("");
      setSearchUnenrolled("");
      setPageEnrolled(1);
      setPagePending(1);
      setPageUnenrolled(1);
      setUserToConfirmEnroll(null);
    }
    onOpenChange(nextOpen);
  };

  // Hàm lấy 2 ký tự viết tắt đại diện họ tên
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Lọc học viên đã ghi danh
  const filteredEnrolled = React.useMemo(() => {
    if (!searchEnrolled.trim()) return enrolledStudents;
    const term = searchEnrolled.toLowerCase();
    return enrolledStudents.filter(
      (s) =>
        s.hoTen?.toLowerCase().includes(term) ||
        s.taiKhoan?.toLowerCase().includes(term) ||
        s.biDanh?.toLowerCase().includes(term)
    );
  }, [enrolledStudents, searchEnrolled]);

  // Lọc học viên chờ xét duyệt
  const filteredPending = React.useMemo(() => {
    if (!searchPending.trim()) return pendingStudents;
    const term = searchPending.toLowerCase();
    return pendingStudents.filter(
      (s) =>
        s.hoTen?.toLowerCase().includes(term) ||
        s.taiKhoan?.toLowerCase().includes(term) ||
        s.biDanh?.toLowerCase().includes(term)
    );
  }, [pendingStudents, searchPending]);

  // Lọc học viên chưa ghi danh
  const filteredUnenrolled = React.useMemo(() => {
    if (!searchUnenrolled.trim()) return unenrolledUsers;
    const term = searchUnenrolled.toLowerCase();
    return unenrolledUsers.filter(
      (s) =>
        s.hoTen?.toLowerCase().includes(term) ||
        s.taiKhoan?.toLowerCase().includes(term) ||
        s.biDanh?.toLowerCase().includes(term)
    );
  }, [unenrolledUsers, searchUnenrolled]);

  // Phân trang Đã ghi danh
  const totalEnrolledCount = filteredEnrolled.length;
  const totalEnrolledPages = Math.ceil(totalEnrolledCount / pageSize) || 1;
  const paginatedEnrolled = React.useMemo(() => {
    const start = (pageEnrolled - 1) * pageSize;
    return filteredEnrolled.slice(start, start + pageSize);
  }, [filteredEnrolled, pageEnrolled, pageSize]);

  // Phân trang Chờ xét duyệt
  const totalPendingCount = filteredPending.length;
  const totalPendingPages = Math.ceil(totalPendingCount / pageSize) || 1;
  const paginatedPending = React.useMemo(() => {
    const start = (pagePending - 1) * pageSize;
    return filteredPending.slice(start, start + pageSize);
  }, [filteredPending, pagePending, pageSize]);

  // Phân trang Chưa ghi danh
  const totalUnenrolledCount = filteredUnenrolled.length;
  const totalUnenrolledPages = Math.ceil(totalUnenrolledCount / pageSize) || 1;
  const paginatedUnenrolled = React.useMemo(() => {
    const start = (pageUnenrolled - 1) * pageSize;
    return filteredUnenrolled.slice(start, start + pageSize);
  }, [filteredUnenrolled, pageUnenrolled, pageSize]);

  // Xử lý xác thực ghi danh từ modal xác nhận (Chức năng 13.1.4)
  const handleConfirmEnroll = async () => {
    if (!userToConfirmEnroll || !maKhoaHoc) return;
    setProcessingUser(userToConfirmEnroll.taiKhoan);
    try {
      await enrollUserMutation.mutateAsync({
        maKhoaHoc,
        taiKhoan: userToConfirmEnroll.taiKhoan,
      });
      setUserToConfirmEnroll(null);
    } finally {
      setProcessingUser(null);
    }
  };

  // Xử lý hủy ghi danh (Đã ghi danh -> Hủy)
  const handleUnenroll = async (taiKhoan: string) => {
    if (!maKhoaHoc) return;
    setProcessingUser(taiKhoan);
    try {
      await unenrollMutation.mutateAsync({
        maKhoaHoc,
        taiKhoan,
      });
    } finally {
      setProcessingUser(null);
    }
  };

  // Xử lý duyệt ghi danh (Chờ duyệt -> Đã ghi danh)
  const handleApprove = async (taiKhoan: string) => {
    if (!maKhoaHoc) return;
    setProcessingUser(taiKhoan);
    try {
      await approveMutation.mutateAsync({
        maKhoaHoc,
        taiKhoan,
      });
    } finally {
      setProcessingUser(null);
    }
  };

  // Xử lý từ chối ghi danh (Chờ duyệt -> Hủy)
  const handleReject = async (taiKhoan: string) => {
    if (!maKhoaHoc) return;
    setProcessingUser(taiKhoan);
    try {
      await rejectMutation.mutateAsync({
        maKhoaHoc,
        taiKhoan,
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const handleRefreshAll = () => {
    refetchEnrolled();
    refetchPending();
    refetchUnenrolled();
  };

  const isRefreshing =
    isFetchingEnrolled || isFetchingPending || isFetchingUnenrolled;

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[850px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header Dialog */}
        <DialogHeader className="p-5 pb-3 border-b bg-card">
          <div className="flex items-center justify-between pr-6">
            <div className="space-y-1">
              <DialogTitle className="text-lg flex items-center gap-2 text-foreground font-semibold">
                <Users className="size-5 text-primary shrink-0" />
                <span>Quản lý ghi danh khóa học</span>
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
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="h-8 gap-1.5 text-xs shrink-0"
              title="Làm mới dữ liệu cả 3 danh sách"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Tabs Điều Hướng: Đã ghi danh / Chờ xét duyệt / Chưa ghi danh */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            if (val) setActiveTab(val);
          }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="px-5 pt-3 pb-0 border-b bg-muted/10">
            <TabsList className="h-9 p-1 bg-muted/60 w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
              <TabsTrigger
                value="enrolled"
                className="gap-2 px-3 text-xs sm:text-sm font-medium"
              >
                <GraduationCap className="size-4" />
                <span>Đã ghi danh</span>
                <span className="ml-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.2 text-[11px] font-semibold">
                  {isLoadingEnrolled ? "..." : enrolledStudents.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="pending"
                className="gap-2 px-3 text-xs sm:text-sm font-medium"
              >
                <Clock className="size-4" />
                <span>Chờ xét duyệt</span>
                <span
                  className={`ml-1 rounded-full px-2 py-0.2 text-[11px] font-semibold ${
                    pendingStudents.length > 0
                      ? "bg-amber-500 text-white animate-pulse"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {isLoadingPending ? "..." : pendingStudents.length}
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="unenrolled"
                className="gap-2 px-3 text-xs sm:text-sm font-medium"
              >
                <UserPlus className="size-4" />
                <span>Chưa ghi danh</span>
                <span className="ml-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.2 text-[11px] font-semibold">
                  {isLoadingUnenrolled ? "..." : unenrolledUsers.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ========================================================
              TAB 1: ĐÃ GHI DANH (API 13.1.2 - LayDanhSachHocVienKhoaHoc)
             ======================================================== */}
          <TabsContent
            value="enrolled"
            className="flex-1 flex flex-col overflow-hidden m-0 p-0"
          >
            {/* Thanh công cụ tìm kiếm */}
            <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm học viên đã ghi danh theo họ tên, tài khoản hoặc bí danh..."
                  value={searchEnrolled}
                  onChange={(e) => {
                    setSearchEnrolled(e.target.value);
                    setPageEnrolled(1);
                  }}
                  className="w-full h-9 pl-9 pr-8 rounded-md border border-input bg-background text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {searchEnrolled && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchEnrolled("");
                      setPageEnrolled(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="text-xs text-muted-foreground shrink-0 font-medium">
                Đã ghi danh:{" "}
                <strong className="text-foreground font-semibold">
                  {filteredEnrolled.length}
                </strong>{" "}
                / {enrolledStudents.length} học viên
              </div>
            </div>

            {/* Danh sách học viên đã ghi danh */}
            <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[440px]">
              {isLoadingEnrolled ? (
                /* Skeleton Loading State */
                <div className="p-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`skeleton-enrolled-${i}`}
                      className="flex items-center justify-between p-2.5 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="size-9 rounded-full shrink-0" />
                        <div className="space-y-1.5 flex-1 max-w-sm">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                  ))}
                </div>
              ) : filteredEnrolled.length === 0 ? (
                /* Empty State */
                <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <GraduationCap className="size-6" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h4 className="text-base font-semibold text-foreground">
                      {searchEnrolled
                        ? "Không tìm thấy học viên phù hợp"
                        : "Khóa học chưa có học viên nào ghi danh"}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {searchEnrolled
                        ? `Không có học viên đã ghi danh nào khớp với từ khóa "${searchEnrolled}".`
                        : "Chuyển sang tab 'Chưa ghi danh' để thêm học viên vào khóa học này."}
                    </p>
                  </div>
                </div>
              ) : (
                /* Table State */
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead className="min-w-[220px]">Học viên</TableHead>
                      <TableHead className="min-w-[140px]">Bí danh</TableHead>
                      <TableHead className="min-w-[120px]">Trạng thái</TableHead>
                      <TableHead className="w-[130px] text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEnrolled.map((student, index) => {
                      const isCurrentProcessing =
                        processingUser === student.taiKhoan;
                      const rowNumber =
                        (pageEnrolled - 1) * pageSize + index + 1;
                      const displayName = student.hoTen || student.taiKhoan;

                      return (
                        <TableRow
                          key={student.taiKhoan}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="text-center font-mono text-xs text-muted-foreground">
                            {rowNumber}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9 border shrink-0">
                                <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
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
                                  @{student.taiKhoan}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground font-mono">
                              {student.biDanh || "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                            >
                              Đã ghi danh
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnenroll(student.taiKhoan)}
                              disabled={
                                Boolean(processingUser) ||
                                unenrollMutation.isPending
                              }
                              className="h-8 px-2.5 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                              title="Hủy ghi danh học viên này khỏi khóa học"
                            >
                              {isCurrentProcessing &&
                              unenrollMutation.isPending ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <UserX className="size-3.5" />
                              )}
                              <span>Hủy ghi danh</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Phân trang Tab Đã ghi danh */}
            {totalEnrolledPages > 1 && (
              <div className="p-3 border-t bg-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                <div>
                  Hiển thị{" "}
                  <strong className="text-foreground">
                    {(pageEnrolled - 1) * pageSize + 1}
                  </strong>{" "}
                  -{" "}
                  <strong className="text-foreground">
                    {Math.min(pageEnrolled * pageSize, totalEnrolledCount)}
                  </strong>{" "}
                  trong tổng số{" "}
                  <strong className="text-foreground">
                    {totalEnrolledCount}
                  </strong>{" "}
                  học viên
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageEnrolled((p) => Math.max(1, p - 1))}
                    disabled={pageEnrolled <= 1}
                    className="h-8 px-2.5 gap-1 text-xs"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>Trước</span>
                  </Button>

                  <span className="text-xs font-medium px-2">
                    Trang{" "}
                    <strong className="text-foreground">{pageEnrolled}</strong>{" "}
                    / {totalEnrolledPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPageEnrolled((p) =>
                        Math.min(totalEnrolledPages, p + 1)
                      )
                    }
                    disabled={pageEnrolled >= totalEnrolledPages}
                    className="h-8 px-2.5 gap-1 text-xs"
                  >
                    <span>Sau</span>
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ========================================================
              TAB 2: CHỜ XÉT DUYỆT (API 13.1.3 - LayDanhSachHocVienChoXetDuyet)
             ======================================================== */}
          <TabsContent
            value="pending"
            className="flex-1 flex flex-col overflow-hidden m-0 p-0"
          >
            {/* Thanh công cụ tìm kiếm */}
            <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm học viên chờ duyệt theo họ tên, tài khoản hoặc bí danh..."
                  value={searchPending}
                  onChange={(e) => {
                    setSearchPending(e.target.value);
                    setPagePending(1);
                  }}
                  className="w-full h-9 pl-9 pr-8 rounded-md border border-input bg-background text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {searchPending && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchPending("");
                      setPagePending(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Xóa tìm kiếm"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="text-xs text-muted-foreground shrink-0 font-medium">
                Chờ xét duyệt:{" "}
                <strong className="text-foreground font-semibold">
                  {filteredPending.length}
                </strong>{" "}
                / {pendingStudents.length} học viên
              </div>
            </div>

            {/* Danh sách học viên chờ xét duyệt */}
            <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[440px]">
              {isLoadingPending ? (
                /* Skeleton Loading State */
                <div className="p-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`skeleton-pending-${i}`}
                      className="flex items-center justify-between p-2.5 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Skeleton className="size-9 rounded-full shrink-0" />
                        <div className="space-y-1.5 flex-1 max-w-sm">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPending.length === 0 ? (
                /* Empty State */
                <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="size-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock className="size-6" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h4 className="text-base font-semibold text-foreground">
                      {searchPending
                        ? "Không tìm thấy học viên phù hợp"
                        : "Không có yêu cầu chờ xét duyệt"}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {searchPending
                        ? `Không có học viên chờ xét duyệt nào khớp với từ khóa "${searchPending}".`
                        : "Hiện tại không có học viên nào gửi yêu cầu tham gia khóa học này."}
                    </p>
                  </div>
                </div>
              ) : (
                /* Table State */
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead className="min-w-[220px]">Học viên</TableHead>
                      <TableHead className="min-w-[140px]">Bí danh</TableHead>
                      <TableHead className="min-w-[130px]">Trạng thái</TableHead>
                      <TableHead className="w-[180px] text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPending.map((student, index) => {
                      const isCurrentProcessing =
                        processingUser === student.taiKhoan;
                      const rowNumber =
                        (pagePending - 1) * pageSize + index + 1;
                      const displayName = student.hoTen || student.taiKhoan;

                      return (
                        <TableRow
                          key={student.taiKhoan}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="text-center font-mono text-xs text-muted-foreground">
                            {rowNumber}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9 border shrink-0">
                                <AvatarFallback className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs">
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
                                  @{student.taiKhoan}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground font-mono">
                              {student.biDanh || "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5"
                            >
                              Chờ duyệt
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Nút Duyệt ghi danh */}
                              <Button
                                size="sm"
                                onClick={() => handleApprove(student.taiKhoan)}
                                disabled={
                                  Boolean(processingUser) ||
                                  approveMutation.isPending ||
                                  rejectMutation.isPending
                                }
                                className="h-8 px-2.5 gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                                title="Duyệt ghi danh học viên này"
                              >
                                {isCurrentProcessing &&
                                approveMutation.isPending ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <Check className="size-3.5" />
                                )}
                                <span>Duyệt</span>
                              </Button>

                              {/* Nút Từ chối */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(student.taiKhoan)}
                                disabled={
                                  Boolean(processingUser) ||
                                  approveMutation.isPending ||
                                  rejectMutation.isPending
                                }
                                className="h-8 px-2.5 gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                                title="Từ chối yêu cầu tham gia"
                              >
                                {isCurrentProcessing &&
                                rejectMutation.isPending ? (
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
                    })}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Phân trang Tab Chờ xét duyệt */}
            {totalPendingPages > 1 && (
              <div className="p-3 border-t bg-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                <div>
                  Hiển thị{" "}
                  <strong className="text-foreground">
                    {(pagePending - 1) * pageSize + 1}
                  </strong>{" "}
                  -{" "}
                  <strong className="text-foreground">
                    {Math.min(pagePending * pageSize, totalPendingCount)}
                  </strong>{" "}
                  trong tổng số{" "}
                  <strong className="text-foreground">
                    {totalPendingCount}
                  </strong>{" "}
                  học viên
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagePending((p) => Math.max(1, p - 1))}
                    disabled={pagePending <= 1}
                    className="h-8 px-2.5 gap-1 text-xs"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>Trước</span>
                  </Button>

                  <span className="text-xs font-medium px-2">
                    Trang{" "}
                    <strong className="text-foreground">{pagePending}</strong>{" "}
                    / {totalPendingPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagePending((p) =>
                        Math.min(totalPendingPages, p + 1)
                      )
                    }
                    disabled={pagePending >= totalPendingPages}
                    className="h-8 px-2.5 gap-1 text-xs"
                  >
                    <span>Sau</span>
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ========================================================
              TAB 3: CHƯA GHI DANH (API 13.1.1 - LayDanhSachNguoiDungChuaGhiDanh)
             ======================================================== */}
          <TabsContent
            value="unenrolled"
            className="flex-1 flex flex-col overflow-hidden m-0 p-0"
          >
            {/* Thanh công cụ tìm kiếm */}
            <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm người dùng chưa ghi danh theo họ tên, tài khoản hoặc bí danh..."
                  value={searchUnenrolled}
                  onChange={(e) => {
                    setSearchUnenrolled(e.target.value);
                    setPageUnenrolled(1);
                  }}
                  className="w-full h-9 pl-9 pr-8 rounded-md border border-input bg-background text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {searchUnenrolled && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchUnenrolled("");
                      setPageUnenrolled(1);
                    }}
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
                  {filteredUnenrolled.length}
                </strong>{" "}
                / {unenrolledUsers.length} người dùng
              </div>
            </div>

            {/* Danh sách người dùng chưa ghi danh */}
            <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[440px]">
              {isLoadingUnenrolled ? (
                /* Skeleton Loading State */
                <div className="p-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`skeleton-unenrolled-${i}`}
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
              ) : filteredUnenrolled.length === 0 ? (
                /* Empty State */
                <div className="py-16 px-4 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <UserCheck className="size-6" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h4 className="text-base font-semibold text-foreground">
                      {searchUnenrolled
                        ? "Không tìm thấy người dùng phù hợp"
                        : "Tất cả học viên đã được ghi danh"}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {searchUnenrolled
                        ? `Không có người dùng chưa ghi danh nào khớp với từ khóa "${searchUnenrolled}".`
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
                    {paginatedUnenrolled.map((user, index) => {
                      const isCurrentProcessing =
                        processingUser === user.taiKhoan;
                      const rowNumber =
                        (pageUnenrolled - 1) * pageSize + index + 1;
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
                              onClick={() => setUserToConfirmEnroll(user)}
                              disabled={
                                Boolean(processingUser) ||
                                enrollUserMutation.isPending
                              }
                              className="h-8 px-2.5 gap-1.5 text-xs bg-primary text-primary-foreground font-medium"
                              title="Xác thực ghi danh người dùng này"
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

            {/* Phân trang Tab Chưa ghi danh */}
            {totalUnenrolledPages > 1 && (
              <div className="p-3 border-t bg-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                <div>
                  Hiển thị{" "}
                  <strong className="text-foreground">
                    {(pageUnenrolled - 1) * pageSize + 1}
                  </strong>{" "}
                  -{" "}
                  <strong className="text-foreground">
                    {Math.min(pageUnenrolled * pageSize, totalUnenrolledCount)}
                  </strong>{" "}
                  trong tổng số{" "}
                  <strong className="text-foreground">
                    {totalUnenrolledCount}
                  </strong>{" "}
                  người dùng
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageUnenrolled((p) => Math.max(1, p - 1))}
                    disabled={pageUnenrolled <= 1}
                    className="h-8 px-2.5 gap-1 text-xs"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>Trước</span>
                  </Button>

                  <span className="text-xs font-medium px-2">
                    Trang{" "}
                    <strong className="text-foreground">
                      {pageUnenrolled}
                    </strong>{" "}
                    / {totalUnenrolledPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPageUnenrolled((p) =>
                        Math.min(totalUnenrolledPages, p + 1)
                      )
                    }
                    disabled={pageUnenrolled >= totalUnenrolledPages}
                    className="h-8 px-2.5 gap-1 text-xs"
                  >
                    <span>Sau</span>
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>

    {/* Modal Xác thực ghi danh người dùng (13.1.4) */}
    <Dialog
      open={Boolean(userToConfirmEnroll)}
      onOpenChange={(isOpen) => !isOpen && setUserToConfirmEnroll(null)}
    >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              <span>Xác thực người dùng ghi danh</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Bạn có chắc chắn muốn xác thực và ghi danh người dùng này vào khóa học không?
            </DialogDescription>
          </DialogHeader>

          {userToConfirmEnroll && (
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                <Avatar className="size-10 border shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {getInitials(
                      userToConfirmEnroll.hoTen || userToConfirmEnroll.taiKhoan,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {userToConfirmEnroll.hoTen || userToConfirmEnroll.taiKhoan}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    @{userToConfirmEnroll.taiKhoan}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-muted/10 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Khóa học:</span>
                  <span className="font-medium text-foreground truncate max-w-[220px]">
                    {course?.tenKhoaHoc}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã khóa học:</span>
                  <span className="font-mono text-muted-foreground">
                    {course?.maKhoaHoc}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUserToConfirmEnroll(null)}
              disabled={enrollUserMutation.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmEnroll}
              disabled={enrollUserMutation.isPending}
              className="bg-primary text-primary-foreground gap-1.5"
            >
              {enrollUserMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <UserCheck className="size-3.5" />
              )}
              <span>Xác thực ghi danh</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
