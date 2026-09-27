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
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCourses,
  useStudentsByCourse,
  usePendingStudentsByCourse,
  useUnenrolledUsersByCourse,
  useApproveEnrollment,
  useRejectEnrollment,
  useEnrollUser,
  useUnenroll,
} from "@/hooks/useCourses";
import { CourseSelector } from "@/components/admin/enrollments/course-selector";
import { EnrolledStudentsTable } from "@/components/admin/enrollments/enrolled-students-table";
import { PendingStudentsTable } from "@/components/admin/enrollments/pending-students-table";
import { UnenrolledStudentsTable } from "@/components/admin/enrollments/unenrolled-students-table";
import { ManualEnrollDialog } from "@/components/admin/enrollments/manual-enroll-dialog";

function EnrollmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseIdParam = searchParams.get("courseId") || "";

  // 1. Fetch danh sách khóa học
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses("");

  // 2. Quản lý khóa học đang chọn & Dialog ghi danh thủ công
  const [selectedCourseId, setSelectedCourseId] = React.useState<string>(courseIdParam);
  const [isManualEnrollOpen, setIsManualEnrollOpen] = React.useState<boolean>(false);

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

  // 5. Fetch danh sách người dùng CHƯA GHI DANH qua API LayDanhSachNguoiDungChuaGhiDanh
  const {
    data: unenrolledUsers = [],
    isLoading: isLoadingUnenrolled,
    isFetching: isFetchingUnenrolled,
    refetch: refetchUnenrolled,
  } = useUnenrolledUsersByCourse(selectedCourseId, Boolean(selectedCourseId));

  // 6. Hooks Ghi danh (GhiDanhKhoaHoc), Duyệt & Hủy (HuyGhiDanh)
  const enrollUserMutation = useEnrollUser();
  const approveMutation = useApproveEnrollment();
  const rejectMutation = useRejectEnrollment();
  const unenrollMutation = useUnenroll();

  const handleEnrollUser = async (taiKhoan: string) => {
    if (!selectedCourseId) return;
    await enrollUserMutation.mutateAsync({
      maKhoaHoc: selectedCourseId,
      taiKhoan,
    });
  };

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
    refetchUnenrolled();
  };

  const isRefreshing = isFetchingStudents || isFetchingPending || isFetchingUnenrolled;

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang & Các nút thao tác */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="size-6 text-primary" />
            <span>Quản lý ghi danh & Xét duyệt học viên</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ghi danh học viên, xét duyệt yêu cầu và quản lý danh sách học viên theo từng khóa học qua API CyberSoft.
          </p>
        </div>

        {selectedCourseId && (
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {/* Nút mở Modal Ghi danh thủ công */}
            <Button
              size="sm"
              onClick={() => setIsManualEnrollOpen(true)}
              className="gap-2 bg-primary text-primary-foreground"
            >
              <UserPlus className="size-4" />
              <span>Ghi danh học viên</span>
            </Button>

            {/* Nút Làm mới dữ liệu */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </Button>
          </div>
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
                <p className="text-[11px] text-muted-foreground">Cần duyệt</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-card shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Users className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Chưa ghi danh</p>
                <p className="text-xl font-bold text-foreground">
                  {isLoadingUnenrolled ? "..." : unenrolledUsers.length}
                </p>
                <p className="text-[11px] text-muted-foreground">Có thể ghi danh</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs Quản lý Học viên: Đã ghi danh / Chờ duyệt / Chưa ghi danh */}
      {selectedCourseId ? (
        <Tabs defaultValue="enrolled" className="space-y-4">
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-10 p-1 bg-muted w-full justify-start sm:justify-center min-w-[360px]">
              <TabsTrigger value="enrolled" className="gap-2 px-3 text-xs sm:text-sm">
                <UserCheck className="size-4" />
                <span>Đã ghi danh</span>
                <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs font-semibold shadow-xs">
                  {students.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="pending" className="gap-2 px-3 text-xs sm:text-sm">
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

              <TabsTrigger value="unenrolled" className="gap-2 px-3 text-xs sm:text-sm">
                <Users className="size-4" />
                <span>Chưa ghi danh</span>
                <span className="ml-1 rounded-full bg-background px-2 py-0.5 text-xs font-semibold shadow-xs">
                  {unenrolledUsers.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>


          {/* Tab 1: Đã ghi danh */}
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

          {/* Tab 2: Chờ xét duyệt */}
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

          {/* Tab 3: Chưa ghi danh */}
          <TabsContent value="unenrolled">
            <UnenrolledStudentsTable
              unenrolledUsers={unenrolledUsers}
              isLoading={isLoadingUnenrolled}
              isFetching={isFetchingUnenrolled}
              courseName={currentCourse?.tenKhoaHoc || selectedCourseId}
              courseId={selectedCourseId}
              onEnroll={handleEnrollUser}
              isEnrolling={enrollUserMutation.isPending}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
          Vui lòng chọn một khóa học ở trên để xem danh sách và ghi danh học viên.
        </div>
      )}

      {/* Modal Hộp thoại Ghi danh thủ công */}
      {selectedCourseId && (
        <ManualEnrollDialog
          open={isManualEnrollOpen}
          onOpenChange={setIsManualEnrollOpen}
          courseId={selectedCourseId}
          courseName={currentCourse?.tenKhoaHoc || selectedCourseId}
          unenrolledUsers={unenrolledUsers}
          isLoading={isLoadingUnenrolled}
          onEnroll={handleEnrollUser}
          isEnrolling={enrollUserMutation.isPending}
        />
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
