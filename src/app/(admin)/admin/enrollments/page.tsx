"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Layers,
  RefreshCw,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCourses, useStudentsByCourse, useUnenroll } from "@/hooks/useCourses";
import { CourseSelector } from "@/components/admin/enrollments/course-selector";
import { EnrolledStudentsTable } from "@/components/admin/enrollments/enrolled-students-table";

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

  // 3. Fetch danh sách học viên của khóa học qua API LayDanhSachHocVienKhoaHoc
  const {
    data: students = [],
    isLoading: isLoadingStudents,
    isFetching: isFetchingStudents,
    refetch,
  } = useStudentsByCourse(selectedCourseId, Boolean(selectedCourseId));

  // 4. Hook Hủy ghi danh học viên
  const unenrollMutation = useUnenroll();

  const handleUnenroll = async (taiKhoan: string) => {
    if (!selectedCourseId) return;
    await unenrollMutation.mutateAsync({
      maKhoaHoc: selectedCourseId,
      taiKhoan,
    });
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="size-6 text-primary" />
            <span>Quản lý ghi danh khóa học</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Theo dõi, tra cứu và quản lý danh sách học viên đã ghi danh vào từng khóa học qua API CyberSoft.
          </p>
        </div>

        {selectedCourseId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetchingStudents}
            className="gap-2 shrink-0 self-start sm:self-auto"
          >
            <RefreshCw className={`size-3.5 ${isFetchingStudents ? "animate-spin" : ""}`} />
            <span>Làm mới danh sách</span>
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
              <div className="size-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <User className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Người tạo</p>
                <p className="text-sm font-semibold truncate">
                  {currentCourse.nguoiTao?.hoTen || "Admin"}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground">
                  @{currentCourse.nguoiTao?.taiKhoan || "admin"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-card shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <GraduationCap className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Học viên ghi danh</p>
                <p className="text-xl font-bold text-foreground">
                  {isLoadingStudents ? "..." : students.length}
                </p>
                <p className="text-[11px] text-muted-foreground">Đang theo học</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bảng danh sách học viên ghi danh */}
      {selectedCourseId ? (
        <EnrolledStudentsTable
          students={students}
          isLoading={isLoadingStudents}
          isFetching={isFetchingStudents}
          courseName={currentCourse?.tenKhoaHoc || selectedCourseId}
          courseId={selectedCourseId}
          onUnenroll={handleUnenroll}
          isUnenrolling={unenrollMutation.isPending}
        />
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center text-muted-foreground">
          Vui lòng chọn một khóa học ở trên để xem danh sách học viên.
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
