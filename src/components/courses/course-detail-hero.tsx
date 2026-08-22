"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Users, Eye, Calendar, Sparkles } from "lucide-react";

import type { Course } from "@/schemas/course.schema";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CourseDetailHeroProps {
  course: Course;
}

export function CourseDetailHero({ course }: CourseDetailHeroProps) {
  const getInitials = (name: string) => {
    if (!name) return "GV";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat("vi-VN", {
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const categoryName = course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Lập trình";
  const categoryId = course.danhMucKhoaHoc?.maDanhMucKhoahoc || "";

  return (
    <section className="relative w-full bg-linear-to-b from-primary/10 via-background to-background py-8 sm:py-12 border-b border-border/40">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="size-3.5 opacity-60" />
          <Link href="/courses" className="hover:text-foreground transition-colors">
            Khóa học
          </Link>
          {categoryId && (
            <>
              <ChevronRight className="size-3.5 opacity-60" />
              <Link
                href={`/courses?category=${categoryId}`}
                className="hover:text-foreground transition-colors"
              >
                {categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="size-3.5 opacity-60" />
          <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-[320px]">
            {course.tenKhoaHoc}
          </span>
        </nav>

        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3 mr-1 text-primary" />
              {categoryName}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {course.tenKhoaHoc}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 leading-relaxed">
            {course.moTa || "Khóa học chất lượng cao với lộ trình bài bản từ cơ bản đến nâng cao từ các chuyên gia CyberSoft."}
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-7 border border-border/60">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {getInitials(course.nguoiTao?.hoTen)}
                </AvatarFallback>
              </Avatar>
              <span className="text-foreground font-medium">
                {course.nguoiTao?.hoTen || "Giảng viên CyberSoft"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="size-4 text-primary" />
              <span>{course.soLuongHocVien ? course.soLuongHocVien.toLocaleString() : "0"} học viên</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Eye className="size-4 text-muted-foreground" />
              <span>{course.luotXem ? course.luotXem.toLocaleString() : "0"} lượt xem</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Cập nhật: {formatDate(course.ngayTao) || "Mới"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
