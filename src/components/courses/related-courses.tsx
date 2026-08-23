"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { useCourseByCategory } from "@/hooks/useCourses";
import { CourseCard } from "./course-card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RelatedCoursesProps {
  categoryId: string;
  currentCourseId: string;
}

export function RelatedCourses({
  categoryId,
  currentCourseId,
}: RelatedCoursesProps) {
  const { data: courses, isLoading } = useCourseByCategory(categoryId);

  const related = React.useMemo(() => {
    if (!courses) return [];
    return courses
      .filter((c) => c.maKhoaHoc !== currentCourseId)
      .slice(0, 3);
  }, [courses, currentCourseId]);

  if (!isLoading && related.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t border-border/50 bg-muted/10">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <span>Khóa học liên quan</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Các khóa học cùng chủ đề bạn có thể quan tâm
            </p>
          </div>

          <Link
            href={`/courses?category=${categoryId}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-xs sm:text-sm font-semibold text-primary hover:text-primary flex items-center gap-1 p-0 hover:bg-transparent"
            )}
          >
            <span>Xem thêm</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-xl border border-border/50 p-4 space-y-3">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((course) => (
              <CourseCard key={course.maKhoaHoc} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
