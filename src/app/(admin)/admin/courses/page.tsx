"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { useCourses } from "@/hooks/useCourses";
import { useAuthStore } from "@/stores/auth.store";
import { useDebounce } from "@/hooks/use-debounce";
import { CourseFilters } from "@/components/admin/courses/course-filters";
import { CourseTable } from "@/components/admin/courses/course-table";
import { CoursePagination } from "@/components/admin/courses/course-pagination";
import { CreateCourseDialog } from "@/components/admin/courses/create-course-dialog";
import { EditCourseDialog } from "@/components/admin/courses/edit-course-dialog";
import { DeleteCourseDialog } from "@/components/admin/courses/delete-course-dialog";
import { UploadCourseImageDialog } from "@/components/admin/courses/upload-course-image-dialog";
import { CourseEnrollmentDialog } from "@/components/admin/courses/course-enrollment-dialog";
import { Button } from "@/components/ui/button";
import type { Course } from "@/schemas/course.schema";

function AdminCoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Quản lý bộ lọc từ query params và state
  const categoryFilter = searchParams.get("category") || "ALL";
  const [creatorFilter, setCreatorFilter] = React.useState<string>("ALL");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);

  // 2. State điều khiển các modal dialogs
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false);
  const [editingCourse, setEditingCourse] = React.useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = React.useState<Course | null>(null);
  const [uploadingCourse, setUploadingCourse] = React.useState<Course | null>(null);
  const [enrollingCourse, setEnrollingCourse] = React.useState<Course | null>(null);
  const pageSize = 10;

  // Lấy thông tin tài khoản người dùng đang đăng nhập (Yêu cầu 1)
  const currentUser = useAuthStore((state) => state.user);
  const currentUsername = currentUser?.taiKhoan || "";

  // Debounce từ khóa tìm kiếm (400ms)
  const debouncedSearch = useDebounce(searchTerm.trim(), 400);

  // Xử lý chuyển đổi danh mục (đồng bộ URL để navbar active) (Yêu cầu 2)
  const handleCategoryChange = (newCat: string) => {
    setPage(1);
    if (newCat === "ALL") {
      router.push("/admin/courses");
    } else {
      router.push(`/admin/courses?category=${newCat}`);
    }
  };

  const handleCreatorChange = (newCreator: string) => {
    setCreatorFilter(newCreator);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setCreatorFilter("ALL");
    setPage(1);
    if (categoryFilter !== "ALL") {
      router.push("/admin/courses");
    }
  };

  // 3. Lấy toàn bộ danh sách khóa học để phân loại và sắp xếp ưu tiên chính xác
  const {
    data: allCourses = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useCourses();

  // 4. Lọc & Sắp xếp dữ liệu theo yêu cầu
  const filteredAndSortedCourses = React.useMemo(() => {
    let list = allCourses.filter(
      (c) => Boolean(c && typeof c.maKhoaHoc === "string" && c.maKhoaHoc.trim()),
    );

    // A. Lọc theo từ khóa tìm kiếm (Tên khóa học hoặc Mã khóa học)
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.tenKhoaHoc?.toLowerCase().includes(term) ||
          c.maKhoaHoc?.toLowerCase().includes(term),
      );
    }

    // B. Lọc theo 6 Danh mục khóa học (Yêu cầu 2)
    if (categoryFilter && categoryFilter !== "ALL") {
      list = list.filter((c) => {
        const catId = c.danhMucKhoaHoc?.maDanhMucKhoahoc;
        return catId?.toLowerCase() === categoryFilter.toLowerCase();
      });
    }

    // C. Lọc theo Người tạo nếu người dùng chọn "Chỉ khóa học của tôi"
    if (creatorFilter === "MINE" && currentUsername) {
      list = list.filter((c) => {
        const creator = c.nguoiTao?.taiKhoan;
        return creator?.toLowerCase() === currentUsername.toLowerCase();
      });
    }

    // D. SẮP XẾP ƯU TIÊN (Yêu cầu 1):
    // Khóa học do người dùng đang đăng nhập tạo sẽ LUÔN ĐƯỢC ƯU TIÊN HIỂN THỊ ĐẦU TIÊN
    return [...list].sort((a, b) => {
      const isAMine =
        Boolean(currentUsername) &&
        a.nguoiTao?.taiKhoan?.toLowerCase() === currentUsername.toLowerCase();
      const isBMine =
        Boolean(currentUsername) &&
        b.nguoiTao?.taiKhoan?.toLowerCase() === currentUsername.toLowerCase();

      // Nếu a do tôi tạo mà b không phải -> a lên đầu
      if (isAMine && !isBMine) return -1;
      // Nếu b do tôi tạo mà a không phải -> b lên đầu
      if (!isAMine && isBMine) return 1;

      // Cùng là của tôi hoặc cùng của người khác: sắp xếp theo ngày tạo mới nhất (nếu có)
      if (a.ngayTao && b.ngayTao) {
        const dateA = new Date(a.ngayTao).getTime();
        const dateB = new Date(b.ngayTao).getTime();
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return dateB - dateA;
        }
      }
      return 0;
    });
  }, [allCourses, debouncedSearch, categoryFilter, creatorFilter, currentUsername]);

  // 5. Phân trang Client-side chuẩn xác
  const totalCount = filteredAndSortedCourses.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedCourses = React.useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredAndSortedCourses.slice(start, start + pageSize);
  }, [filteredAndSortedCourses, safePage, pageSize]);

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang & mô tả */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Quản lý khóa học
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Xem, tìm kiếm và quản lý danh sách toàn bộ các khóa học trong hệ thống
          E-Learning. Các khóa học do bạn tạo sẽ luôn được ưu tiên hiển thị ở đầu bảng.
        </p>
      </div>

      {/* Thanh công cụ: Tìm kiếm, lọc 6 danh mục, lọc người tạo & Nút chức năng */}
      <CourseFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onResetSearch={handleResetSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={handleCategoryChange}
        creatorFilter={creatorFilter}
        onCreatorFilterChange={handleCreatorChange}
        currentUsername={currentUsername}
        isLoading={isFetching}
        onRefresh={() => refetch()}
        totalCount={totalCount}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* Thông báo lỗi nếu API gặp sự cố */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span className="text-sm font-medium">
              Không thể tải danh sách khóa học. Vui lòng thử lại sau!
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-destructive/30 hover:bg-destructive/20 text-destructive h-8 gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            Thử lại
          </Button>
        </div>
      )}

      {/* Bảng dữ liệu khóa học với highlight khóa học của người dùng */}
      <CourseTable
        courses={paginatedCourses}
        isLoading={isLoading}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        onResetSearch={handleResetSearch}
        isFiltered={Boolean(debouncedSearch || categoryFilter !== "ALL" || creatorFilter !== "ALL")}
        currentUsername={currentUsername}
        onEditCourse={setEditingCourse}
        onDeleteCourse={setDeletingCourse}
        onUploadImage={setUploadingCourse}
        onEnrollUsers={setEnrollingCourse}
      />

      {/* Thanh điều khiển phân trang */}
      <CoursePagination
        currentPage={safePage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        disabled={isFetching}
      />

      {/* Modal Dialog Tạo khóa học mới */}
      <CreateCourseDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {/* Modal Dialog Chỉnh sửa khóa học */}
      <EditCourseDialog
        course={editingCourse}
        open={Boolean(editingCourse)}
        onOpenChange={(open) => !open && setEditingCourse(null)}
      />

      {/* Modal Dialog Xác nhận xóa khóa học */}
      <DeleteCourseDialog
        course={deletingCourse}
        open={Boolean(deletingCourse)}
        onOpenChange={(open) => !open && setDeletingCourse(null)}
      />

      {/* Modal Dialog Đổi ảnh bìa khóa học */}
      <UploadCourseImageDialog
        course={uploadingCourse}
        open={Boolean(uploadingCourse)}
        onOpenChange={(open) => !open && setUploadingCourse(null)}
      />

      {/* Modal Dialog Ghi danh người dùng vào khóa học */}
      <CourseEnrollmentDialog
        course={enrollingCourse}
        open={Boolean(enrollingCourse)}
        onOpenChange={(open) => !open && setEnrollingCourse(null)}
      />
    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-6 text-center text-sm text-muted-foreground">
          Đang tải danh sách khóa học...
        </div>
      }
    >
      <AdminCoursesContent />
    </React.Suspense>
  );
}
