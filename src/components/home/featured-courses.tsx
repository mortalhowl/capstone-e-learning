"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { useCourses, useCourseCategories, useCourseByCategory } from "@/hooks/useCourses";
import { CourseCard } from "@/components/courses/course-card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FeaturedCourses() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const { data: categories, isLoading: isLoadingCategories } = useCourseCategories();

  const {
    data: allCourses,
    isLoading: isLoadingAll,
  } = useCourses();

  const {
    data: categoryCourses,
    isLoading: isLoadingCategoryCourses,
  } = useCourseByCategory(selectedCategory === "all" ? "" : selectedCategory);

  const isLoadingCourses = selectedCategory === "all" ? isLoadingAll : isLoadingCategoryCourses;
  const courses = (selectedCategory === "all" ? allCourses : categoryCourses) || [];
  const displayCourses = courses.slice(0, 8);

  return (
    <section id="featured-courses" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer shrink-0",
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Tất cả
          </button>

          {isLoadingCategories ? (
            <div className="flex items-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          ) : (
            categories?.map((cat) => (
              <button
                key={cat.maDanhMuc}
                type="button"
                onClick={() => setSelectedCategory(cat.maDanhMuc)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer shrink-0",
                  selectedCategory === cat.maDanhMuc
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat.tenDanhMuc}
              </button>
            ))
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Khóa học nổi bật
            </h2>
            <p className="text-sm text-muted-foreground">
              Các khóa học được học viên quan tâm và đăng ký nhiều nhất
            </p>
          </div>

          <Link
            href="/courses"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group text-sm font-semibold text-primary hover:text-primary flex items-center gap-1.5 self-start sm:self-auto p-0 hover:bg-transparent"
            )}
          >
            <span>Xem tất cả</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoadingCourses ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-xl border border-border/50 p-4 space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
                <div className="flex items-center gap-2 pt-2">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCourses.map((course) => (
              <CourseCard key={course.maKhoaHoc} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3 rounded-xl border border-dashed border-border/80 bg-muted/20">
            <BookOpen className="size-10 text-muted-foreground mx-auto" />
            <p className="text-base font-semibold text-foreground">
              Không có khóa học nào trong danh mục này
            </p>
            <p className="text-xs text-muted-foreground">
              Vui lòng chọn danh mục khác hoặc xem toàn bộ khóa học
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
