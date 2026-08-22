"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";

import type { Course } from "@/schemas/course.schema";
import { useCourses, useCourseByCategory } from "@/hooks/useCourses";
import { CourseCard } from "./course-card";
import { CourseFilterSidebar } from "./course-filter-sidebar";
import { CourseListHeader, type SortOption } from "./course-list-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function CourseGridContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "9", 10);

  const [sortBy, setSortBy] = React.useState<SortOption>("newest");

  const updateUrl = React.useCallback(
    (newParams: { search?: string; category?: string; page?: number; pageSize?: number }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newParams.search !== undefined) {
        if (newParams.search) params.set("search", newParams.search);
        else params.delete("search");
      }
      if (newParams.category !== undefined) {
        if (newParams.category && newParams.category !== "all") params.set("category", newParams.category);
        else params.delete("category");
      }
      if (newParams.page !== undefined) {
        if (newParams.page > 1) params.set("page", newParams.page.toString());
        else params.delete("page");
      }
      if (newParams.pageSize !== undefined) {
        if (newParams.pageSize !== 9) params.set("pageSize", newParams.pageSize.toString());
        else params.delete("pageSize");
      }
      router.push(`/courses?${params.toString()}`);
    },
    [router, searchParams]
  );

  const { data: allCourses, isLoading: isLoadingAll } = useCourses();
  const { data: categoryCourses, isLoading: isLoadingCategory } = useCourseByCategory(
    category === "all" ? "" : category
  );

  const isCategoryMode = Boolean(category && category !== "all");
  const rawCourses = React.useMemo(() => {
    return (isCategoryMode ? categoryCourses : allCourses) || [];
  }, [isCategoryMode, categoryCourses, allCourses]);

  const isLoading = isCategoryMode ? isLoadingCategory : isLoadingAll;

  const filteredCourses = React.useMemo(() => {
    let list = [...rawCourses];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      list = list.filter((course) =>
        course.tenKhoaHoc.toLowerCase().includes(query) ||
        course.moTa?.toLowerCase().includes(query)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "views") {
        return (b.luotXem || 0) - (a.luotXem || 0);
      }
      if (sortBy === "students") {
        return (b.soLuongHocVien || 0) - (a.soLuongHocVien || 0);
      }
      if (sortBy === "name") {
        return a.tenKhoaHoc.localeCompare(b.tenKhoaHoc, "vi");
      }
      return new Date(b.ngayTao || 0).getTime() - new Date(a.ngayTao || 0).getTime();
    });

    return list;
  }, [rawCourses, search, sortBy]);

  const totalCount = filteredCourses.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedCourses = React.useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredCourses.slice(startIndex, startIndex + pageSize);
  }, [filteredCourses, safeCurrentPage, pageSize]);

  const handleSearchChange = (val: string) => {
    updateUrl({ search: val, page: 1 });
  };

  const handleCategoryChange = (val: string) => {
    updateUrl({ category: val, page: 1 });
  };

  const handleReset = () => {
    setSortBy("newest");
    router.push("/courses");
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    updateUrl({ pageSize: size, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 rounded-xl border border-border/60 bg-card p-5 shadow-xs">
          <CourseFilterSidebar
            search={search}
            onSearchChange={handleSearchChange}
            category={category}
            onCategoryChange={handleCategoryChange}
            onReset={handleReset}
          />
        </aside>

        <main className="lg:col-span-9 space-y-6">
          <CourseListHeader
            totalCount={totalCount}
            sortBy={sortBy}
            onSortChange={setSortBy}
            search={search}
            onSearchChange={handleSearchChange}
            category={category}
            onCategoryChange={handleCategoryChange}
            onReset={handleReset}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: pageSize }).map((_, i) => (
                <div key={i} className="flex flex-col rounded-xl border border-border/50 p-4 space-y-3">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-6 w-full rounded-md" />
                  <div className="flex items-center gap-2 pt-2">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedCourses.map((course: Course) => (
                <CourseCard key={course.maKhoaHoc} course={course} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 rounded-2xl border border-dashed border-border/80 bg-muted/20">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Inbox className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-foreground">
                  Không tìm thấy khóa học phù hợp
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                  Vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bộ lọc để xem toàn bộ khóa học.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Trang</span>
                <strong className="text-foreground">{safeCurrentPage}</strong>
                <span>/ {totalPages}</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage <= 1}
                  className="size-8 cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </Button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1;
                  const isCurrent = pageNum === safeCurrentPage;

                  if (
                    totalPages > 7 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - safeCurrentPage) > 1
                  ) {
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                      return (
                        <span key={pageNum} className="px-1 text-xs text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        "size-8 p-0 text-xs font-medium cursor-pointer",
                        isCurrent && "font-bold shadow-xs"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage >= totalPages}
                  className="size-8 cursor-pointer"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Hiển thị:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-8 px-2.5 text-xs font-semibold cursor-pointer"
                    )}
                  >
                    <span>{pageSize} / trang</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-28 p-1">
                    <DropdownMenuGroup>
                      {[6, 9, 12, 18, 24].map((size) => (
                        <DropdownMenuItem
                          key={size}
                          onClick={() => handlePageSizeChange(size)}
                          className={cn("text-xs cursor-pointer", pageSize === size && "font-bold text-primary")}
                        >
                          {size} / trang
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
