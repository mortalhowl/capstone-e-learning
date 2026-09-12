"use client";

import * as React from "react";
import Image from "next/image";
import {
  Eye,
  Users,
  Calendar,
  MoreVertical,
  ExternalLink,
  Edit,
  Trash2,
  UserPlus,
  BookOpen,
  AlertCircle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Course } from "@/schemas/course.schema";

interface CourseTableProps {
  courses?: Course[];
  isLoading: boolean;
  isFetching: boolean;
  onRefresh?: () => void;
  onResetSearch?: () => void;
  isFiltered?: boolean;
  onEditCourse?: (course: Course) => void;
}

export function CourseTable({
  courses = [],
  isLoading,
  isFetching,
  onResetSearch,
  isFiltered,
  onEditCourse,
}: CourseTableProps) {
  // State quản lý danh sách ảnh bị lỗi để fallback sang placeholder
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});

  const handleImageError = (maKhoaHoc: string) => {
    setImageErrors((prev) => ({ ...prev, [maKhoaHoc]: true }));
  };

  // 1. Loading State (Hiển thị 6 dòng skeleton)
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[320px]">Khóa học</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead className="text-right">Học viên</TableHead>
              <TableHead className="text-right">Lượt xem</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-[70px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-md shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-12 ml-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
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

  // 2. Empty State (Không tìm thấy dữ liệu)
  if (courses.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <BookOpen className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium">Không tìm thấy khóa học nào</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {isFiltered
              ? "Không có khóa học nào khớp với từ khóa tìm kiếm của bạn. Vui lòng thử từ khóa khác."
              : "Hiện tại hệ thống chưa có dữ liệu khóa học."}
          </p>
        </div>
        {isFiltered && onResetSearch && (
          <Button variant="outline" size="sm" onClick={onResetSearch} className="mt-2">
            Xóa bộ lọc tìm kiếm
          </Button>
        )}
      </div>
    );
  }

  // 3. Normal Table State (với visual indicator khi đang fetch ngầm)
  return (
    <div className="relative rounded-lg border bg-card overflow-hidden shadow-xs">
      {/* Loading bar mỏng ở đầu bảng khi background fetching */}
      {isFetching && !isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse z-10" />
      )}

      <div className="overflow-x-auto">
        <Table className={isFetching && !isLoading ? "opacity-75 transition-opacity" : ""}>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="min-w-[280px]">Khóa học</TableHead>
              <TableHead className="min-w-[140px]">Danh mục</TableHead>
              <TableHead className="min-w-[140px]">Người tạo</TableHead>
              <TableHead className="text-right min-w-[100px]">Học viên</TableHead>
              <TableHead className="text-right min-w-[100px]">Lượt xem</TableHead>
              <TableHead className="min-w-[120px]">Ngày tạo</TableHead>
              <TableHead className="w-[70px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => {
              const hasImgError = imageErrors[course.maKhoaHoc];

              return (
                <TableRow key={course.maKhoaHoc} className="hover:bg-muted/40 transition-colors">
                  {/* Cột 1: Thông tin khóa học */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 rounded-md overflow-hidden bg-muted border shrink-0 flex items-center justify-center">
                        {course.hinhAnh && !hasImgError ? (
                          <img
                            src={course.hinhAnh}
                            alt={course.tenKhoaHoc}
                            className="size-full object-cover"
                            onError={() => handleImageError(course.maKhoaHoc)}
                            loading="lazy"
                          />
                        ) : (
                          <BookOpen className="size-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div
                          className="font-medium text-sm text-foreground line-clamp-1 hover:text-primary transition-colors cursor-pointer"
                          title={course.tenKhoaHoc}
                        >
                          {course.tenKhoaHoc}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-4">
                            {course.maKhoaHoc}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Cột 2: Danh mục */}
                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Chưa phân loại"}
                    </Badge>
                  </TableCell>

                  {/* Cột 3: Người tạo */}
                  <TableCell>
                    <div className="text-sm font-medium">
                      {course.nguoiTao?.hoTen || "Quản trị viên"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      @{course.nguoiTao?.taiKhoan || "admin"}
                    </div>
                  </TableCell>

                  {/* Cột 4: Số học viên */}
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium">
                      <Users className="size-3.5 text-muted-foreground" />
                      <span>{course.soLuongHocVien?.toLocaleString() || 0}</span>
                    </div>
                  </TableCell>

                  {/* Cột 5: Lượt xem */}
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Eye className="size-3.5" />
                      <span>{course.luotXem?.toLocaleString() || 0}</span>
                    </div>
                  </TableCell>

                  {/* Cột 6: Ngày tạo */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3.5 shrink-0" />
                      <span>{course.ngayTao || "—"}</span>
                    </div>
                  </TableCell>

                  {/* Cột 7: Thao tác (Dropdown Actions Menu) */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="size-8 p-0"
                            title="Tùy chọn"
                          >
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Tùy chọn</span>
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <ExternalLink className="size-4" />
                          <span>Xem chi tiết</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <UserPlus className="size-4" />
                          <span>Ghi danh học viên</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer"
                          onClick={() => onEditCourse?.(course)}
                        >
                          <Edit className="size-4" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          <span>Xóa khóa học</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
