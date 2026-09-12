"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { usePaginatedCourse } from "@/hooks/useCourses";
import { useDebounce } from "@/hooks/use-debounce";
import { CourseFilters } from "@/components/admin/courses/course-filters";
import { CourseTable } from "@/components/admin/courses/course-table";
import { CoursePagination } from "@/components/admin/courses/course-pagination";
import { Button } from "@/components/ui/button";

export default function AdminCoursesPage() {
  // 1. Quản lý State: tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const pageSize = 10;

  // 2. Debounce từ khóa tìm kiếm (chờ 400ms sau khi người dùng dừng gõ)
  const debouncedSearch = useDebounce(searchTerm.trim(), 400);

  // 3. Mỗi khi từ khóa debounced thay đổi -> reset về Trang 1
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // 4. Gọi API LayDanhSachKhoaHoc_PhanTrang qua TanStack Query
  const { data, isLoading, isFetching, error, refetch } = usePaginatedCourse(
    debouncedSearch,
    page,
    pageSize,
  );

  const courses = data?.items || [];
  const totalPages = data?.totalPages || 0;
  const totalCount = data?.totalCount || 0;
  const currentPage = data?.currentPage || page;

  // Xử lý sự kiện xóa bộ lọc
  const handleResetSearch = () => {
    setSearchTerm("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang & mô tả */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Quản lý khóa học
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Xem, tìm kiếm và quản lý danh sách toàn bộ các khóa học trong hệ thống
          E-Learning.
        </p>
      </div>

      {/* Thanh công cụ: Tìm kiếm & Nút chức năng */}
      <CourseFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onResetSearch={handleResetSearch}
        isLoading={isFetching}
        onRefresh={() => refetch()}
        totalCount={totalCount}
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

      {/* Bảng dữ liệu khóa học */}
      <CourseTable
        courses={courses}
        isLoading={isLoading}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        onResetSearch={handleResetSearch}
        isFiltered={Boolean(debouncedSearch)}
      />

      {/* Thanh điều khiển phân trang */}
      <CoursePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        disabled={isFetching}
      />
    </div>
  );
}
