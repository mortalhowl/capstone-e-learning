"use client";

import * as React from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeleteCourse } from "@/hooks/useCourses";
import type { Course } from "@/schemas/course.schema";

interface DeleteCourseDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCourseDialog({
  course,
  open,
  onOpenChange,
}: DeleteCourseDialogProps) {
  const deleteCourseMutation = useDeleteCourse();

  if (!course) return null;

  const isDeleting = deleteCourseMutation.isPending;

  const handleConfirmDelete = async () => {
    try {
      await deleteCourseMutation.mutateAsync(course.maKhoaHoc);
      onOpenChange(false);
    } catch {
      // Toast lỗi đã được xử lý tự động trong hook useDeleteCourse
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="gap-2">
          <div className="size-11 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <AlertTriangle className="size-6" />
          </div>
          <DialogTitle className="text-lg text-foreground">
            Xác nhận xóa khóa học?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Hành động này <strong className="text-destructive">không thể hoàn tác</strong>.
            Khóa học sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu của hệ thống.
          </DialogDescription>
        </DialogHeader>

        {/* Thông tin chi tiết khóa học bị xóa */}
        <div className="rounded-lg border bg-muted/40 p-3.5 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Mã khóa học:</span>
            <Badge variant="outline" className="font-mono text-xs font-semibold">
              {course.maKhoaHoc}
            </Badge>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground font-medium">Tên khóa học:</span>
            <p className="font-medium text-foreground text-sm line-clamp-2">
              {course.tenKhoaHoc}
            </p>
          </div>
          {course.soLuongHocVien > 0 && (
            <div className="pt-1.5 border-t border-border/60 text-xs text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ Khóa học này hiện đang có <strong>{course.soLuongHocVien}</strong> học viên ghi danh. Nếu máy chủ phát hiện học viên, yêu cầu xóa sẽ bị từ chối.
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            <span>{isDeleting ? "Đang xóa..." : "Xác nhận xóa"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
