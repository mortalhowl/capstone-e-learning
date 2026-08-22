import * as React from "react";
import type { Metadata } from "next";
import { CourseGridContainer } from "@/components/courses/course-grid-container";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Danh Sách Khóa Học",
  description: "Khám phá hàng ngàn khóa học lập trình chất lượng cao từ CyberSoft Academy.",
};

export default function CoursesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 max-w-7xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <CourseGridContainer />
    </React.Suspense>
  );
}
