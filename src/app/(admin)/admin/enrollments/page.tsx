"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Layers,
  RefreshCw,
  Clock,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCourses,
  useStudentsByCourse,
  usePendingStudentsByCourse,
  useApproveEnrollment,
  useRejectEnrollment,
  useUnenroll,
} from "@/hooks/useCourses";
import { CourseSelector } from "@/components/admin/enrollments/course-selector";
import { EnrolledStudentsTable } from "@/components/admin/enrollments/enrolled-students-table";
import { PendingStudentsTable } from "@/components/admin/enrollments/pending-students-table";

function EnrollmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseIdParam = searchParams.get("courseId") || "";

  // 1. Fetch danh sách khóa học
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses("");

  // 2. Quản lý khóa học đang chọn
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>(courseIdParam);

  // Cập nhật selectedCourseId khi URL param hoặc danh sách khóa học thay đổi
  React.useEffect(() => {
    if (courseIdParam) {
      setSelectedCourseId(courseIdParam);
    } else if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].maKhoaHoc);
    }
  }, [courseIdParam, courses, selectedCourseId]);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    router.replace(`/admin/enrollments?courseId=${encodeURIComponent(courseId)}`);
  };

  const currentCourse = courses.find((c) => c.maKhoaHoc === selectedCourseId);

  // 3. Fetch danh sách học viên ĐÃ GHI DANH qua API LayDanhSachHocVienKhoaHoc
  const {
    data: students = [],
    isLoading: isLoadingStudents,
    isFetching: isFetchingStudents,
    refetch: refetchStudents,
  } = useStudentsByCourse(selectedCourseId, Boolean(selectedCourseId));

  // 4. Fetch danh sách học viên CHỜ DUYỆT qua API LayDanhSachHocVienChoXetDuyet
  const {
    data: pendingStudents = [],
    isLoading: isLoadingPending,
    isFetching: isFetchingPending,
    refetch: refetchPending,
  } = usePendingStudentsByCourse(selectedCourseId, Boolean(selectedCourseId));

  // 5. Hooks Duyệt (GhiDanhKhoaHoc) & Từ chối/Hủy (HuyGhiDanh)
  const approveMutation = useApproveEnrollment();
  const rejectMutation = useRejectEnrollment();
  const unenrollMutation = useUnenroll();

  const handleApprove = async (taiKhoan: string) => {
    if (!selectedCourseId) return;
    await approveMutation.mutateAsync({
      maKhoaHoc: selectedCourseId,
      taiKhoan,
    });
  };

  const handleReject = async (taiKhoan: string) => {
    if (!selectedCourseId) return;
    await rejectMutation.mutateAsync({
      maKhoaHoc: selectedCourseId,
      taiKhoan,
    });
  };

  const handleUnenroll = async (taiKhoan: string) => {
    if (!selectedCourseId) return;
    await unenrollMutation.mutateAsync({
      maKhoaHoc: selectedCourseId,
      taiKhoan,
    });
  };

  const handleRefreshAll = () => {
    refetchStudents();
    refetchPending();
  };

  const isRefreshing = isFetchingStudents || isFetchingPending;

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="size-6 text-primary" />
            <span>Quản lý ghi danh & Xét duyệt học viên</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Theo dõi danh sách học viên và xét duyệt (Duyệt / Từ chối) các yêu cầu tham gia khóa học qua API CyberSoft.
          </p>
        </div>

        {selectedCourseId && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="gap-2 shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Làm mới dữ liệu</span>
          </Button>
        )}
      </div>

      {/* Bộ chọn khóa học */}
      <Card className="border shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <CourseSelector
            courses={courses}
            selectedCourseId={selectedCourseId}
            onSelectCourse={handleSelectCourse}
            isLoading={isLoadingCourses}
          />
        </CardContent>
      </Card>

      {/* Thẻ thống kê thông tin khóa học đang chọn */}
      {currentCourse && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border bg-card shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <BookOpen className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Khóa học</p>
                <p className="text-sm font-semibold truncate" title={currentCourse.tenKhoaHoc}>
                  {currentCourse.tenKhoaHoc}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground">{currentCourse.maKhoaHoc}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-card shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Layers className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Danh mục</p>
                <p className="text-sm font-semibold truncate">
                  {currentCourse.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Chưa phân loại"}
                </p>
                <p className="text-[11px] text-muted-foreground">Phân loại khóa học</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-card shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <GraduationCap className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Đã ghi danh</p>
                <p className="text-xl font-bold text-foreground">
                  {isLoadingStudents ? "..." : students.length}
                </p>
                <p className="text-[11px] text-muted-foreground">Học viên chính thức</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`border bg-card shadow-xs ${pendingStudents.length > 0 ? "border-amber-500/40 bg-amber-500/5" : ""}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Chờ xét duyệt</p>
                <p className={`text-xl font-bold ${pendingStudents.length > 0 ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
                  {isLoadingPending ? "..." : pendingStudents.length}
                </p>
                <p className="text-[11px] text-muted-foreground">Cần quản trị viên duyệt</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs Quản lý Học viên & Xét duyệt */}
      {selectedCourseId ? (
        <Tabs defaultValue="enrolled" className="space-y-4">
          <TabsList className="h-10 p-1 bg-muted">
            <TabsTrigger value="enrolled" className="gap-2 px-3">
              <UserCheck className="size-4" />
              <span>Học viên đã ghi danh</span>
              <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs font-semibold shadow-xs">
                {students.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2 px-3">
              <Clock className="size-4" />
              <span>Chờ xét duyệt</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold shadow-xs ${
                  pendingStudents.length > 0
                    ? "bg-amber-500 text-white animate-pulse"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {pendingStudents.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled">
            <EnrolledStudentsTable
              students={students}
              isLoading={isLoadingStudents}
              isFetching={isFetchingStudents}
              courseName={currentCourse?.tenKhoaHoc || selectedCourseId}
              courseId={selectedCourseId}
              onUnenroll={handleUnenroll}
              isUnenrolling={unenrollMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="pending">
            <PendingStudentsTable
              pendingStudents={pendingStudents}
              isLoading={isLoadingPending}
              isFetching={isFetchingPending}
              courseName={currentCourse?.tenKhoaHoc || selectedCourseId}
              courseId={selectedCourseId}
              onApprove={handleApprove}
              onReject={handleReject}
              isApproving={approveMutation.isPending}
              isRejecting={rejectMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
          Vui lòng chọn một khóa học ở trên để xem danh sách và xét duyệt học viên.
        </div>
      )}
    </div>
  );
}

export default function AdminEnrollmentsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted-foreground">
          Đang tải trang quản lý ghi danh...
        </div>
      }
    >
      <EnrollmentContent />
    </React.Suspense>
  );
}
