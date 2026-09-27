"use client";

import * as React from "react";
import { Upload, X, Loader2, ImageIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
import { useUploadCourseImage } from "@/hooks/useCourses";
import type { Course } from "@/schemas/course.schema";

interface UploadCourseImageDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadCourseImageDialog({
  course,
  open,
  onOpenChange,
}: UploadCourseImageDialogProps) {
  const uploadCourseImageMutation = useUploadCourseImage();

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset state khi đóng modal hoặc đổi course
  React.useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [open]);

  if (!course) return null;

  const handleProcessFile = (file: File) => {
    // 1. Kiểm tra định dạng ảnh
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chỉ chọn tệp hình ảnh (PNG, JPG, WEBP, GIF)!");
      return;
    }

    // 2. Kiểm tra dung lượng tối đa 3MB
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Dung lượng ảnh vượt quá 3MB. Vui lòng chọn ảnh nhỏ hơn!");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemoveSelected = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isUploading = uploadCourseImageMutation.isPending;

  // Submit Upload FormData
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn hình ảnh cần tải lên!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      formData.append("tenKhoaHoc", course.tenKhoaHoc);

      await uploadCourseImageMutation.mutateAsync(formData);
      onOpenChange(false);
    } catch {
      // Toast lỗi đã được xử lý trong useUploadCourseImage
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Cập nhật ảnh bìa khóa học</DialogTitle>
          <DialogDescription>
            Tải lên hình ảnh mới cho khóa học bằng multipart/form-data.
          </DialogDescription>
        </DialogHeader>

        {/* Thông tin khóa học */}
        <div className="rounded-lg border bg-muted/40 p-3 flex items-center justify-between text-sm">
          <div className="space-y-0.5 min-w-0 pr-2">
            <span className="text-xs text-muted-foreground">Khóa học:</span>
            <p className="font-semibold text-foreground line-clamp-1">
              {course.tenKhoaHoc}
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs shrink-0">
            {course.maKhoaHoc}
          </Badge>
        </div>

        {/* Khung tải ảnh / Xem trước ảnh */}
        <div className="space-y-3 py-1">
          {previewUrl ? (
            <div className="space-y-2">
              <div className="relative w-full h-52 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Ảnh mới xem trước"
                  className="size-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-xs"
                  onClick={handleRemoveSelected}
                  disabled={isUploading}
                  className="absolute top-2 right-2 size-7 rounded-full shadow-md"
                  title="Hủy chọn ảnh"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span className="truncate max-w-[280px]">
                    Tệp: <strong>{selectedFile.name}</strong>
                  </span>
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              )}
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[0.99]"
                  : "hover:border-primary/60 hover:bg-muted/30"
              }`}
            >
              <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Upload className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Kéo thả file ảnh vào đây hoặc <span className="text-primary underline underline-offset-2">chọn từ máy tính</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ PNG, JPG, WEBP, GIF (Dung lượng tối đa 3MB)
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <DialogFooter className="pt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="gap-2 bg-primary text-primary-foreground"
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            <span>{isUploading ? "Đang tải lên..." : "Lưu ảnh mới"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
