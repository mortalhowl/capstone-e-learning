"use client";

import * as React from "react";
import {
  Search,
  UserPlus,
  UserX,
  Loader2,
  BookOpen,
  RefreshCw,
  X,
  GraduationCap,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCheck,
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
  useUnenrolledCoursesByUser,
  useEnrolledCoursesByUser,
} from "@/hooks/useUsers";
import { useEnrollUser, useUnenroll } from "@/hooks/useCourses";
import type { UserItem } from "@/schemas/user.schema";
import type {
  UnenrolledCourse,
  UserEnrolledCourse,
} from "@/schemas/course.schema";

interface UserEnrollmentDialogProps {
  user: UserItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEnrollmentDialog({
  user,
  open,
  onOpenChange,
}: UserEnrollmentDialogProps) {
  const taiKhoan = user?.taiKhoan || "";
  const isTeacher = user?.maLoaiNguoiDung === "GV";

  // Tab state: "unenrolled" | "enrolled" | "pending"
  const [activeTab, setActiveTab] = React.useState<string>("unenrolled");

  // Search & Pagination state for unenrolled courses tab (13.2.1)
  const [searchUnenrolled, setSearchUnenrolled] = React.useState<string>("");
  const [pageUnenrolled, setPageUnenrolled] = React.useState<number>(1);

  // Search & Pagination state for enrolled courses tab (13.2.2)
  const [searchEnrolled, setSearchEnrolled] = React.useState<string>("");
  const [pageEnrolled, setPageEnrolled] = React.useState<number>(1);

  // Modal xác nhận ghi danh khóa học (13.2.1)
  const [courseToConfirmEnroll, setCourseToConfirmEnroll] =
    React.useState<UnenrolledCourse | null>(null);
  const [processingCourseId, setProcessingCourseId] = React.useState<
    string | null
  >(null);

  // Modal xác nhận hủy ghi danh khóa học (13.2.2)
  const [courseToConfirmUnenroll, setCourseToConfirmUnenroll] =
    React.useState<UserEnrolledCourse | null>(null);
  const [processingUnenrollCourseId, setProcessingUnenrollCourseId] =
    React.useState<string | null>(null);

  const pageSize = 10;

  // 1. API 13.2.1: LayDanhSachKhoaHocChuaGhiDanh
  const {
    data: unenrolledCourses = [],
    isLoading: isLoadingUnenrolled,
    isFetching: isFetchingUnenrolled,
    refetch: refetchUnenrolled,
  } = useUnenrolledCoursesByUser(taiKhoan, open && Boolean(taiKhoan));

  // 2. API 13.2.2: LayDanhSachKhoaHocDaXetDuyet (Đã ghi danh)
  const {
    data: enrolledCourses = [],
    isLoading: isLoadingEnrolled,
    isFetching: isFetchingEnrolled,
    refetch: refetchEnrolled,
  } = useEnrolledCoursesByUser(taiKhoan, open && Boolean(taiKhoan));

  // Mutations
  const enrollUserMutation = useEnrollUser();
  const unenrollMutation = useUnenroll();

  // Reset state when dialog closes
  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSearchUnenrolled("");
      setPageUnenrolled(1);
      setCourseToConfirmEnroll(null);
      setProcessingCourseId(null);

      setSearchEnrolled("");
      setPageEnrolled(1);
      setCourseToConfirmUnenroll(null);
      setProcessingUnenrollCourseId(null);
    }
    onOpenChange(nextOpen);
  };

  // Helper lấy avatar initials
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Lọc danh sách khóa học chưa ghi danh (13.2.1)
  const filteredUnenrolled = React.useMemo(() => {
    const term = searchUnenrolled.trim().toLowerCase();
    if (!term) return unenrolledCourses;
    return unenrolledCourses.filter((course) => {
      const matchName = course.tenKhoaHoc?.toLowerCase().includes(term);
      const matchCode = course.maKhoaHoc?.toLowerCase().includes(term);
      const matchAlias = course.biDanh?.toLowerCase().includes(term);
      return matchName || matchCode || matchAlias;
    });
  }, [unenrolledCourses, searchUnenrolled]);

  const totalUnenrolledPages = Math.max(
    1,
    Math.ceil(filteredUnenrolled.length / pageSize),
  );
  const paginatedUnenrolled = React.useMemo(() => {
    const startIndex = (pageUnenrolled - 1) * pageSize;
    return filteredUnenrolled.slice(startIndex, startIndex + pageSize);
  }, [filteredUnenrolled, pageUnenrolled, pageSize]);

  // Lọc danh sách khóa học đã ghi danh (13.2.2)
  const filteredEnrolled = React.useMemo(() => {
    const term = searchEnrolled.trim().toLowerCase();
    if (!term) return enrolledCourses;
    return enrolledCourses.filter((course) => {
      const matchName = course.tenKhoaHoc?.toLowerCase().includes(term);
      const matchCode = course.maKhoaHoc?.toLowerCase().includes(term);
      const matchAlias = course.biDanh?.toLowerCase().includes(term);
      return matchName || matchCode || matchAlias;
    });
  }, [enrolledCourses, searchEnrolled]);

  const totalEnrolledPages = Math.max(
    1,
    Math.ceil(filteredEnrolled.length / pageSize),
  );
  const paginatedEnrolled = React.useMemo(() => {
    const startIndex = (pageEnrolled - 1) * pageSize;
    return filteredEnrolled.slice(startIndex, startIndex + pageSize);
  }, [filteredEnrolled, pageEnrolled, pageSize]);

  // Thực hiện ghi danh khóa học cho học viên (13.2.1)
  const handleConfirmEnroll = async () => {
    if (!courseToConfirmEnroll || !user) return;
    const targetCourse = courseToConfirmEnroll;
    setProcessingCourseId(targetCourse.maKhoaHoc);
    try {
      await enrollUserMutation.mutateAsync({
        maKhoaHoc: targetCourse.maKhoaHoc,
        taiKhoan: user.taiKhoan,
      });
      setCourseToConfirmEnroll(null);
      refetchUnenrolled();
      refetchEnrolled();
    } catch {
      // Error handled by hook toast
    } finally {
      setProcessingCourseId(null);
    }
  };

  // Thực hiện hủy ghi danh khóa học của học viên (13.2.2)
  const handleConfirmUnenroll = async () => {
    if (!courseToConfirmUnenroll || !user) return;
    const targetCourse = courseToConfirmUnenroll;
    setProcessingUnenrollCourseId(targetCourse.maKhoaHoc);
    try {
      await unenrollMutation.mutateAsync({
        maKhoaHoc: targetCourse.maKhoaHoc,
        taiKhoan: user.taiKhoan,
      });
      setCourseToConfirmUnenroll(null);
      refetchEnrolled();
      refetchUnenrolled();
    } catch {
      // Error handled by hook toast
    } finally {
      setProcessingUnenrollCourseId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden"
        >
          {/* Header Thông tin người dùng & Dialog Title */}
          <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-bold tracking-tight">
                    Quản lý ghi danh khóa học
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  Xem danh sách, ghi danh và quản lý các khóa học của học viên trong hệ thống E-Learning.
                </DialogDescription>
              </div>

              {/* Close Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 rounded-full shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => handleDialogChange(false)}
              >
                <X className="size-4" />
                <span className="sr-only">Đóng</span>
              </Button>
            </div>

            {/* Chi tiết người dùng */}
            {user && (
              <div className="mt-4 p-3 rounded-lg border bg-background/80 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-11 border shrink-0">
                    <AvatarFallback
                      className={
                        isTeacher
                          ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold"
                          : "bg-primary/15 text-primary font-semibold"
                      }
                    >
                      {getInitials(user.hoTen)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {user.hoTen}
                      </span>
                      {isTeacher ? (
                        <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[10px] py-0 px-1.5 font-medium gap-1">
                          <ShieldCheck className="size-3" />
                          <span>Giáo vụ</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-[10px] py-0 px-1.5 font-medium gap-1"
                        >
                          <GraduationCap className="size-3 text-muted-foreground" />
                          <span>Học viên</span>
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3">
                      <span className="font-mono">@{user.taiKhoan}</span>
                      {user.email && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px]" title={user.email}>
                            {user.email}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thống kê khóa học */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <div className="px-2.5 py-1 rounded bg-muted/60 border font-medium flex items-center gap-1.5">
                    <CheckCheck className="size-3.5 text-primary" />
                    <span>
                      Đã ghi danh:{" "}
                      <strong className="text-foreground">
                        {isLoadingEnrolled ? "..." : enrolledCourses.length}
                      </strong>{" "}
                      khóa
                    </span>
                  </div>

                  <div className="px-2.5 py-1 rounded bg-muted/60 border font-medium flex items-center gap-1.5">
                    <BookOpen className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      Chưa ghi danh:{" "}
                      <strong className="text-foreground">
                        {isLoadingUnenrolled ? "..." : unenrolledCourses.length}
                      </strong>{" "}
                      khóa
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>

          {/* Navigation Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="px-6 border-b bg-background">
              <TabsList className="bg-transparent h-12 p-0 gap-6">
                <TabsTrigger
                  value="unenrolled"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-1 h-full font-medium text-xs sm:text-sm gap-2 relative"
                >
                  <BookOpen className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Khóa học chưa ghi danh</span>
                  {!isLoadingUnenrolled && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-[11px] px-1.5 py-0 rounded-full font-mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    >
                      {unenrolledCourses.length}
                    </Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="enrolled"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-1 h-full font-medium text-xs sm:text-sm gap-2 relative"
                >
                  <CheckCheck className="size-4 text-primary" />
                  <span>Khóa học đã ghi danh</span>
                  {!isLoadingEnrolled && (
                    <Badge
                      variant="secondary"
                      className="ml-1 text-[11px] px-1.5 py-0 rounded-full font-mono bg-primary/15 text-primary"
                    >
                      {enrolledCourses.length}
                    </Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="pending"
                  disabled
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-1 h-full font-medium text-xs sm:text-sm gap-2 relative opacity-50 cursor-not-allowed"
                  title="Chức năng đang cập nhật (13.2.3)"
                >
                  <Clock className="size-4 text-amber-500" />
                  <span>Khóa học chờ xét duyệt</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: Khóa học chưa ghi danh (13.2.1) */}
            <TabsContent
              value="unenrolled"
              className="m-0 flex-1 flex flex-col min-h-0 outline-hidden"
            >
              {/* Toolbar: Tìm kiếm & Refresh */}
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchUnenrolled}
                    onChange={(e) => {
                      setSearchUnenrolled(e.target.value);
                      setPageUnenrolled(1);
                    }}
                    placeholder="Tìm theo tên hoặc mã khóa học..."
                    className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-8 text-xs sm:text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {searchUnenrolled && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchUnenrolled("");
                        setPageUnenrolled(1);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 text-xs"
                    onClick={() => refetchUnenrolled()}
                    disabled={isFetchingUnenrolled}
                  >
                    <RefreshCw
                      className={`size-3.5 ${isFetchingUnenrolled ? "animate-spin" : ""}`}
                    />
                    <span className="hidden sm:inline">Làm mới</span>
                  </Button>
                </div>
              </div>

              {/* Body: Danh sách khóa học chưa ghi danh */}
              <div className="flex-1 overflow-auto p-4">
                {isLoadingUnenrolled ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 border rounded-lg gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-10 rounded-md" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-24 rounded" />
                      </div>
                    ))}
                  </div>
                ) : filteredUnenrolled.length === 0 ? (
                  <div className="h-64 border rounded-lg border-dashed flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-2">
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <BookOpen className="size-6" />
                    </div>
                    <p className="font-medium text-foreground text-sm">
                      {searchUnenrolled
                        ? "Không tìm thấy khóa học nào phù hợp"
                        : "Người dùng này đã ghi danh vào tất cả khóa học"}
                    </p>
                    <p className="text-xs max-w-sm">
                      {searchUnenrolled
                        ? `Không có kết quả nào khớp với "${searchUnenrolled}". Vui lòng thử từ khóa khác.`
                        : "Không có khóa học nào người dùng này chưa ghi danh."}
                    </p>
                    {searchUnenrolled && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setSearchUnenrolled("");
                          setPageUnenrolled(1);
                        }}
                        className="text-xs h-8"
                      >
                        Xóa tìm kiếm
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="w-[50px] text-center">
                            #
                          </TableHead>
                          <TableHead className="min-w-[260px]">
                            Khóa học
                          </TableHead>
                          <TableHead className="min-w-[140px]">
                            Bí danh
                          </TableHead>
                          <TableHead className="w-[130px] text-right">
                            Thao tác
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUnenrolled.map((course, index) => {
                          const isProcessing =
                            processingCourseId === course.maKhoaHoc;
                          const rowNumber =
                            (pageUnenrolled - 1) * pageSize + index + 1;

                          return (
                            <TableRow
                              key={course.maKhoaHoc}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              {/* STT */}
                              <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                {rowNumber}
                              </TableCell>

                              {/* Thông tin Khóa học */}
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="size-10 rounded-md border bg-muted shrink-0 overflow-hidden flex items-center justify-center relative">
                                    {course.hinhAnh ? (
                                      /* eslint-disable-next-line @next/next/no-img-element */
                                      <img
                                        src={course.hinhAnh}
                                        alt={course.tenKhoaHoc}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = "none";
                                        }}
                                      />
                                    ) : null}
                                    <BookOpen className="size-4 text-muted-foreground/60 absolute" />
                                  </div>
                                  <div className="min-w-0 space-y-1">
                                    <div
                                      className="font-medium text-sm text-foreground line-clamp-1"
                                      title={course.tenKhoaHoc}
                                    >
                                      {course.tenKhoaHoc}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] font-mono px-1.5 py-0"
                                      >
                                        {course.maKhoaHoc}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Bí danh */}
                              <TableCell>
                                <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px] block">
                                  {course.biDanh || "—"}
                                </span>
                              </TableCell>

                              {/* Nút Thao tác: Ghi danh */}
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="default"
                                  onClick={() => setCourseToConfirmEnroll(course)}
                                  disabled={isProcessing}
                                  className="h-8 text-xs font-medium gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                >
                                  {isProcessing ? (
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
                  </div>
                )}
              </div>

              {/* Footer Phân trang cho tab Khóa học chưa ghi danh */}
              {filteredUnenrolled.length > 0 && (
                <div className="p-4 border-t bg-muted/20 flex items-center justify-between gap-4 text-xs">
                  <div className="text-muted-foreground">
                    Hiển thị{" "}
                    <span className="font-medium text-foreground">
                      {(pageUnenrolled - 1) * pageSize + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium text-foreground">
                      {Math.min(
                        pageUnenrolled * pageSize,
                        filteredUnenrolled.length,
                      )}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-medium text-foreground">
                      {filteredUnenrolled.length}
                    </span>{" "}
                    khóa học
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={pageUnenrolled <= 1}
                      onClick={() =>
                        setPageUnenrolled((prev) => Math.max(1, prev - 1))
                      }
                    >
                      <ChevronLeft className="size-4" />
                      <span className="sr-only">Trang trước</span>
                    </Button>
                    <span className="px-2 font-medium">
                      Trang {pageUnenrolled} / {totalUnenrolledPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={pageUnenrolled >= totalUnenrolledPages}
                      onClick={() =>
                        setPageUnenrolled((prev) =>
                          Math.min(totalUnenrolledPages, prev + 1),
                        )
                      }
                    >
                      <ChevronRight className="size-4" />
                      <span className="sr-only">Trang sau</span>
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: Khóa học đã ghi danh (13.2.2) */}
            <TabsContent
              value="enrolled"
              className="m-0 flex-1 flex flex-col min-h-0 outline-hidden"
            >
              {/* Toolbar: Tìm kiếm & Refresh */}
              <div className="p-4 border-b bg-muted/10 flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchEnrolled}
                    onChange={(e) => {
                      setSearchEnrolled(e.target.value);
                      setPageEnrolled(1);
                    }}
                    placeholder="Tìm theo tên hoặc mã khóa học..."
                    className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-8 text-xs sm:text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {searchEnrolled && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchEnrolled("");
                        setPageEnrolled(1);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 text-xs"
                    onClick={() => refetchEnrolled()}
                    disabled={isFetchingEnrolled}
                  >
                    <RefreshCw
                      className={`size-3.5 ${isFetchingEnrolled ? "animate-spin" : ""}`}
                    />
                    <span className="hidden sm:inline">Làm mới</span>
                  </Button>
                </div>
              </div>

              {/* Body: Danh sách khóa học đã ghi danh */}
              <div className="flex-1 overflow-auto p-4">
                {isLoadingEnrolled ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 border rounded-lg gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-10 rounded-md" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-24 rounded" />
                      </div>
                    ))}
                  </div>
                ) : filteredEnrolled.length === 0 ? (
                  <div className="h-64 border rounded-lg border-dashed flex flex-col items-center justify-center p-6 text-center text-muted-foreground space-y-2">
                    <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                      <CheckCheck className="size-6" />
                    </div>
                    <p className="font-medium text-foreground text-sm">
                      {searchEnrolled
                        ? "Không tìm thấy khóa học nào phù hợp"
                        : "Học viên chưa ghi danh khóa học nào"}
                    </p>
                    <p className="text-xs max-w-sm">
                      {searchEnrolled
                        ? `Không có kết quả nào khớp với "${searchEnrolled}". Vui lòng thử từ khóa khác.`
                        : "Học viên này hiện chưa ghi danh vào bất kỳ khóa học nào."}
                    </p>
                    {searchEnrolled && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setSearchEnrolled("");
                          setPageEnrolled(1);
                        }}
                        className="text-xs h-8"
                      >
                        Xóa tìm kiếm
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          <TableHead className="w-[50px] text-center">
                            #
                          </TableHead>
                          <TableHead className="min-w-[260px]">
                            Khóa học
                          </TableHead>
                          <TableHead className="min-w-[140px]">
                            Bí danh
                          </TableHead>
                          <TableHead className="w-[140px] text-right">
                            Thao tác
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedEnrolled.map((course, index) => {
                          const isProcessing =
                            processingUnenrollCourseId === course.maKhoaHoc;
                          const rowNumber =
                            (pageEnrolled - 1) * pageSize + index + 1;

                          return (
                            <TableRow
                              key={course.maKhoaHoc}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              {/* STT */}
                              <TableCell className="text-center font-mono text-xs text-muted-foreground">
                                {rowNumber}
                              </TableCell>

                              {/* Thông tin Khóa học */}
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="size-10 rounded-md border bg-muted/50 shrink-0 flex items-center justify-center">
                                    <BookOpen className="size-4 text-primary" />
                                  </div>
                                  <div className="min-w-0 space-y-1">
                                    <div
                                      className="font-medium text-sm text-foreground line-clamp-1"
                                      title={course.tenKhoaHoc}
                                    >
                                      {course.tenKhoaHoc}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] font-mono px-1.5 py-0"
                                      >
                                        {course.maKhoaHoc}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Bí danh */}
                              <TableCell>
                                <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px] block">
                                  {course.biDanh || "—"}
                                </span>
                              </TableCell>

                              {/* Nút Thao tác: Hủy ghi danh */}
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setCourseToConfirmUnenroll(course)
                                  }
                                  disabled={isProcessing}
                                  className="h-8 text-xs font-medium gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                                >
                                  {isProcessing ? (
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
                  </div>
                )}
              </div>

              {/* Footer Phân trang cho tab Khóa học đã ghi danh */}
              {filteredEnrolled.length > 0 && (
                <div className="p-4 border-t bg-muted/20 flex items-center justify-between gap-4 text-xs">
                  <div className="text-muted-foreground">
                    Hiển thị{" "}
                    <span className="font-medium text-foreground">
                      {(pageEnrolled - 1) * pageSize + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium text-foreground">
                      {Math.min(
                        pageEnrolled * pageSize,
                        filteredEnrolled.length,
                      )}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-medium text-foreground">
                      {filteredEnrolled.length}
                    </span>{" "}
                    khóa học
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={pageEnrolled <= 1}
                      onClick={() =>
                        setPageEnrolled((prev) => Math.max(1, prev - 1))
                      }
                    >
                      <ChevronLeft className="size-4" />
                      <span className="sr-only">Trang trước</span>
                    </Button>
                    <span className="px-2 font-medium">
                      Trang {pageEnrolled} / {totalEnrolledPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-8"
                      disabled={pageEnrolled >= totalEnrolledPages}
                      onClick={() =>
                        setPageEnrolled((prev) =>
                          Math.min(totalEnrolledPages, prev + 1),
                        )
                      }
                    >
                      <ChevronRight className="size-4" />
                      <span className="sr-only">Trang sau</span>
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* MODAL XÁC NHẬN GHI DANH KHÓA HỌC (13.2.1) */}
      <Dialog
        open={Boolean(courseToConfirmEnroll)}
        onOpenChange={(val) => !val && setCourseToConfirmEnroll(null)}
      >
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <UserPlus className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  Xác nhận ghi danh khóa học
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Bạn có chắc chắn muốn ghi danh học viên này vào khóa học?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {courseToConfirmEnroll && user && (
            <div className="space-y-3 my-2">
              {/* Thông tin học viên */}
              <div className="p-3 rounded-lg border bg-muted/20 flex items-center gap-3">
                <Avatar className="size-9 border shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {getInitials(user.hoTen)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {user.hoTen}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    @{user.taiKhoan}
                  </p>
                </div>
              </div>

              {/* Thông tin khóa học */}
              <div className="p-3 rounded-lg border bg-muted/10 text-xs space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-muted-foreground shrink-0">Khóa học:</span>
                  <span className="font-medium text-foreground text-right">
                    {courseToConfirmEnroll.tenKhoaHoc}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã khóa học:</span>
                  <span className="font-mono text-muted-foreground">
                    {courseToConfirmEnroll.maKhoaHoc}
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
              onClick={() => setCourseToConfirmEnroll(null)}
              disabled={enrollUserMutation.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmEnroll}
              disabled={enrollUserMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
            >
              {enrollUserMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <UserPlus className="size-3.5" />
              )}
              <span>Xác nhận ghi danh</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL XÁC NHẬN HỦY GHI DANH KHÓA HỌC (13.2.2) */}
      <Dialog
        open={Boolean(courseToConfirmUnenroll)}
        onOpenChange={(val) => !val && setCourseToConfirmUnenroll(null)}
      >
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <UserX className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-destructive">
                  Xác nhận hủy ghi danh khóa học
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Bạn có chắc chắn muốn hủy ghi danh học viên này khỏi khóa học?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {courseToConfirmUnenroll && user && (
            <div className="space-y-3 my-2">
              {/* Thông tin học viên */}
              <div className="p-3 rounded-lg border bg-muted/20 flex items-center gap-3">
                <Avatar className="size-9 border shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {getInitials(user.hoTen)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {user.hoTen}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    @{user.taiKhoan}
                  </p>
                </div>
              </div>

              {/* Thông tin khóa học */}
              <div className="p-3 rounded-lg border border-destructive/20 bg-destructive/5 text-xs space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-muted-foreground shrink-0">Khóa học:</span>
                  <span className="font-medium text-foreground text-right">
                    {courseToConfirmUnenroll.tenKhoaHoc}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã khóa học:</span>
                  <span className="font-mono text-muted-foreground">
                    {courseToConfirmUnenroll.maKhoaHoc}
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
              onClick={() => setCourseToConfirmUnenroll(null)}
              disabled={unenrollMutation.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleConfirmUnenroll}
              disabled={unenrollMutation.isPending}
              className="gap-1.5"
            >
              {unenrollMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <UserX className="size-3.5" />
              )}
              <span>Xác nhận hủy ghi danh</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
