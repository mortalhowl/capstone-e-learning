"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Eye } from "lucide-react";

import type { Course } from "@/schemas/course.schema";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const [imgSrc, setImgSrc] = React.useState<string>(course.hinhAnh);
  const [imgError, setImgError] = React.useState(false);

  const getInitials = (name: string) => {
    if (!name) return "GV";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-border/60 bg-card text-card-foreground shadow-xs transition-all duration-300 hover:shadow-md hover:border-border hover:-translate-y-1 overflow-hidden">
      <div className="flex flex-col">
        <Link
          href={`/courses/${course.maKhoaHoc}`}
          className="relative aspect-video w-full overflow-hidden bg-muted block"
        >
          {!imgError ? (
            <Image
              src={imgSrc}
              alt={course.tenKhoaHoc}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => {
                setImgError(true);
                setImgSrc("");
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-muted/60 text-muted-foreground p-4 text-center">
              <span className="font-semibold text-xs tracking-wider uppercase opacity-70">
                CyberSoft
              </span>
              <span className="text-xs line-clamp-1 mt-1 font-medium text-foreground/80">
                {course.tenKhoaHoc}
              </span>
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge
              variant="secondary"
              className="bg-background/90 text-foreground backdrop-blur-md shadow-xs text-[11px] font-medium border-border/40"
            >
              {course.danhMucKhoaHoc?.tenDanhMucKhoaHoc || "Lập trình"}
            </Badge>
          </div>
        </Link>

        <div className="p-4 space-y-3">
          <Link href={`/courses/${course.maKhoaHoc}`}>
            <h3 className="font-bold text-base line-clamp-2 text-foreground group-hover:text-primary transition-colors min-h-[48px] leading-snug">
              {course.tenKhoaHoc}
            </h3>
          </Link>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar className="size-6 border border-border/50 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                {getInitials(course.nguoiTao?.hoTen)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-medium text-foreground/90">
              {course.nguoiTao?.hoTen || "Giảng viên CyberSoft"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground font-medium">
              <span>(</span>
              <Eye className="size-3" />
              <span>{course.luotXem ? course.luotXem.toLocaleString() : "1,200"}</span>
              <span>học viên)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground font-medium">Học phí</span>
            <span className="text-base font-bold text-primary">Miễn phí</span>
          </div>

          <Link
            href={`/courses/${course.maKhoaHoc}`}
            className={cn(
              buttonVariants({ size: "sm" }),
              "h-8 px-3.5 text-xs font-semibold shadow-xs transition-transform active:scale-95"
            )}
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
