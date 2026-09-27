"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Calendar, ArrowRight, Trash2, BookOpen, AlertTriangle } from "lucide-react";

import type { CourseBasic } from "@/schemas/course.schema";
import { useUnenroll } from "@/hooks/useCourses";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { formatDate, cn } from "@/lib/utils";

interface ProfileEnrolledCoursesProps {
  courses: CourseBasic[];
  username: string;
}

export function ProfileEnrolledCourses({
  courses,
  username,
}: ProfileEnrolledCoursesProps) {
  const [selectedCourse, setSelectedCourse] = React.useState<CourseBasic | null>(null);
  const unenrollMutation = useUnenroll();

  const handleConfirmUnenroll = () => {
    if (!selectedCourse) return;

    unenrollMutation.mutate(
      {
        maKhoaHoc: selectedCourse.maKhoaHoc,
        taiKhoan: username,
      },
      {
        onSettled: () => {
          setSelectedCourse(null);
        },
      }
    );
  };

  if (!courses || courses.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-6">
        <div className="size-14 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <BookOpen className="size-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-foreground">
            Bạn chưa đăng ký khóa học nào
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Khám phá hàng trăm khóa học lập trình chất lượng cao từ cơ bản đến nâng cao ngay hôm nay.
          </p>
        </div>
        <Link
          href="/courses"
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1.5")}
        >
          <span>Khám phá khóa học</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span>Khóa học đã đăng ký</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {courses.length}
          </span>
        </h2>
      </div>

      <div className="space-y-4">
        {courses.map((course) => (
          <EnrolledCourseCard
            key={course.maKhoaHoc}
            course={course}
            onUnenroll={() => setSelectedCourse(course)}
          />
        ))}
      </div>

      <Dialog open={Boolean(selectedCourse)} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="size-5" />
            </div>
            <DialogTitle>Xác nhận hủy ghi danh</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground pt-1">
              Bạn có chắc chắn muốn hủy ghi danh khóa học{" "}
              <strong className="text-foreground">
                &ldquo;{selectedCourse?.tenKhoaHoc}&rdquo;
              </strong>
              ? Hành động này có thể cần bạn phải đăng ký lại sau này.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <DialogClose render={<Button variant="outline" size="sm" />}>
              Hủy bỏ
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmUnenroll}
              disabled={unenrollMutation.isPending}
              className="cursor-pointer"
            >
              {unenrollMutation.isPending ? "Đang xử lý..." : "Xác nhận hủy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EnrolledCourseCard({
  course,
  onUnenroll,
}: {
  course: CourseBasic;
  onUnenroll: () => void;
}) {
  const [imgSrc, setImgSrc] = React.useState<string>(course.hinhAnh);
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-card hover:border-border transition-all duration-200 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <Link
          href={`/courses/${course.maKhoaHoc}`}
          className="relative aspect-video w-full sm:w-40 sm:h-24 shrink-0 overflow-hidden rounded-lg bg-muted block border border-border/40"
        >
          {!imgError ? (
            <Image
              src={imgSrc}
              alt={course.tenKhoaHoc}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => {
                setImgError(true);
                setImgSrc("");
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted/60 text-muted-foreground p-2 text-center">
              <span className="font-bold text-[10px] uppercase opacity-70">
                CyberSoft
              </span>
              <span className="text-[10px] line-clamp-1 mt-0.5 font-medium text-foreground/80">
                {course.tenKhoaHoc}
              </span>
            </div>
          )}
        </Link>

        <div className="space-y-1.5 min-w-0">
          <Link href={`/courses/${course.maKhoaHoc}`}>
            <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {course.tenKhoaHoc}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {course.moTa || "Khóa học chất lượng cao từ CyberSoft Academy."}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1">
              <Calendar className="size-3 text-muted-foreground/70" />
              <span>{formatDate(course.ngayTao) || "Mới"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="size-3 text-muted-foreground/70" />
              <span>{course.luotXem ? course.luotXem.toLocaleString() : "0"} lượt xem</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-border/40">
        <Link
          href={`/courses/${course.maKhoaHoc}`}
          className={cn(
            buttonVariants({ size: "sm" }),
            "h-8 px-3 text-xs font-semibold shadow-xs"
          )}
        >
          Xem chi tiết
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={onUnenroll}
          className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30 cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only sm:not-sr-only sm:ml-1">Hủy</span>
        </Button>
      </div>
    </div>
  );
}
