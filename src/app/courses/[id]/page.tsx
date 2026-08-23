"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { useCourse } from "@/hooks/useCourses";
import { CourseDetailHero } from "@/components/courses/course-detail-hero";
import { CourseEnrollSidebar } from "@/components/courses/course-enroll-sidebar";
import { CourseDetailTabs } from "@/components/courses/course-detail-tabs";
import { RelatedCourses } from "@/components/courses/related-courses";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CourseDetailPage() {
  const params = useParams();

  const rawId = (params?.id as string) || "";
  const courseId = decodeURIComponent(rawId);

  const { data: course, isLoading, isError } = useCourse(courseId);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="bg-muted/30 py-12 border-b border-border/40">
          <div className="container mx-auto px-4 max-w-7xl space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-full max-w-xl" />
            <Skeleton className="h-5 w-full max-w-md" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-10 w-64 rounded-lg" />
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center container mx-auto px-4 py-16 text-center space-y-4">
        <div className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="size-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Không tìm thấy khóa học</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Khóa học bạn đang tìm kiếm có thể đã bị xóa hoặc đường dẫn không chính xác.
          </p>
        </div>
        <Link
          href="/courses"
          className={cn(buttonVariants({ variant: "default" }), "mt-4 flex items-center gap-2")}
        >
          <ArrowLeft className="size-4" />
          <span>Quay lại danh sách khóa học</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CourseDetailHero course={course} />

      <main className="container mx-auto px-4 py-10 max-w-7xl flex-1">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <CourseDetailTabs course={course} />
          </div>

          <aside className="lg:col-span-4">
            <CourseEnrollSidebar course={course} />
          </aside>
        </div>
      </main>

      {course.danhMucKhoaHoc?.maDanhMucKhoahoc && (
        <RelatedCourses
          categoryId={course.danhMucKhoaHoc.maDanhMucKhoahoc}
          currentCourseId={course.maKhoaHoc}
        />
      )}
    </div>
  );
}
