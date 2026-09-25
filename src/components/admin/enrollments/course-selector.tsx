"use client";

import * as React from "react";
import { BookOpen, Check, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Course } from "@/schemas/course.schema";

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  isLoading?: boolean;
  currentUsername?: string;
}

export function CourseSelector({
  courses,
  selectedCourseId,
  onSelectCourse,
  isLoading,
  currentUsername,
}: CourseSelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredCourses = React.useMemo(() => {
    const validCourses = courses.filter(
      (c) => Boolean(c && typeof c.maKhoaHoc === "string" && c.maKhoaHoc.trim()),
    );
    if (!searchTerm.trim()) return validCourses;
    const term = searchTerm.toLowerCase();
    return validCourses.filter(
      (c) =>
        c.tenKhoaHoc?.toLowerCase().includes(term) ||
        c.maKhoaHoc?.toLowerCase().includes(term),
    );
  }, [courses, searchTerm]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="size-4 text-primary" />
          <span>Chọn khóa học để xem học viên:</span>
        </label>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm tên hoặc mã khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-md border border-input bg-background text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto p-1 border rounded-lg bg-muted/20">
        {isLoading ? (
          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
            Đang tải danh sách khóa học...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
            Không tìm thấy khóa học nào phù hợp.
          </div>
        ) : (
          filteredCourses.map((course, index) => {
            const isSelected = course.maKhoaHoc === selectedCourseId;
            const isMyCourse =
              Boolean(currentUsername) &&
              course.nguoiTao?.taiKhoan?.toLowerCase() ===
                currentUsername?.toLowerCase();

            return (
              <button
                key={course.maKhoaHoc || `course-${index}`}
                type="button"
                onClick={() => onSelectCourse(course.maKhoaHoc)}
                className={`flex items-center gap-3 p-2.5 rounded-md text-left transition-all border ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : isMyCourse
                    ? "border-primary/40 bg-card hover:bg-muted/60"
                    : "border-border/60 bg-card hover:bg-muted/60 hover:border-border"
                }`}
              >
                <div className="size-10 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0 border">
                  {course.hinhAnh ? (
                    <img
                      src={course.hinhAnh}
                      alt={course.tenKhoaHoc}
                      className="size-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <BookOpen className="size-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium text-xs truncate ${
                      isSelected ? "text-primary font-semibold" : "text-foreground"
                    }`}
                    title={course.tenKhoaHoc}
                  >
                    {course.tenKhoaHoc}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] px-1 py-0 h-4"
                    >
                      {course.maKhoaHoc}
                    </Badge>
                    {isMyCourse && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1 py-0 h-4 font-normal"
                      >
                        Của bạn
                      </Badge>
                    )}
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Users className="size-3" />
                      {course.soLuongHocVien || 0} HV
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                    <Check className="size-3" />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
