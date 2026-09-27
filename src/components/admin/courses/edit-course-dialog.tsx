"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import dayjs from "dayjs";
import { Upload, X, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useCourseCategories,
  useUpdateCourse,
  useUpdateCourseWithImage,
} from "@/hooks/useCourses";
import { useAuthStore } from "@/stores/auth.store";
import { MA_NHOM } from "@/lib/constants";
import { slugify } from "@/lib/slugify";
import type { Course } from "@/schemas/course.schema";

const EditCourseFormSchema = z.object({
  maKhoaHoc: z.string().min(1, "Mã khóa học không được để trống"),
  tenKhoaHoc: z.string().min(5, "Tên khóa học phải có tối thiểu 5 ký tự"),
  biDanh: z.string().min(1, "Bí danh không được để trống"),
  maDanhMucKhoaHoc: z.string().min(1, "Vui lòng chọn danh mục khóa học"),
  moTa: z.string().min(10, "Mô tả khóa học phải có tối thiểu 10 ký tự"),
  hinhAnhUrl: z.string().optional(),
});

type EditCourseFormValues = z.infer<typeof EditCourseFormSchema>;

interface EditCourseDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCourseDialog({
  course,
  open,
  onOpenChange,
}: EditCourseDialogProps) {
  const user = useAuthStore((state) => state.user);
  const { data: categories = [], isLoading: isLoadingCategories } = useCourseCategories();

  const updateCourseMutation = useUpdateCourse();
  const updateCourseWithImageMutation = useUpdateCourseWithImage();

  // State quản lý file ảnh mới và preview ảnh
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditCourseFormValues>({
    resolver: zodResolver(EditCourseFormSchema),
    defaultValues: {
      maKhoaHoc: "",
      tenKhoaHoc: "",
      biDanh: "",
      maDanhMucKhoaHoc: "",
      moTa: "",
      hinhAnhUrl: "",
    },
  });

  // Pre-fill dữ liệu mỗi khi course prop thay đổi
  React.useEffect(() => {
    if (course) {
      reset({
        maKhoaHoc: course.maKhoaHoc,
        tenKhoaHoc: course.tenKhoaHoc,
        biDanh: course.biDanh,
        maDanhMucKhoaHoc: course.danhMucKhoaHoc?.maDanhMucKhoahoc || "",
        moTa: course.moTa,
        hinhAnhUrl: course.hinhAnh || "",
      });
      setPreviewUrl(course.hinhAnh || null);
      setSelectedFile(null);
    }
  }, [course, reset]);

  const tenKhoaHoc = watch("tenKhoaHoc");

  // Tự động cập nhật bí danh khi tên khóa học thay đổi
  const handleGenerateSlug = () => {
    if (tenKhoaHoc) {
      setValue("biDanh", slugify(tenKhoaHoc), { shouldValidate: true });
    }
  };

  // Xử lý chọn file ảnh mới từ máy
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Dung lượng ảnh tối đa là 3MB!");
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Xóa ảnh / Hủy chọn file mới
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValue("hinhAnhUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isSubmitting =
    updateCourseMutation.isPending || updateCourseWithImageMutation.isPending;

  // Xử lý submit cập nhật
  const onSubmit = async (values: EditCourseFormValues) => {
    if (!course) return;

    const maNhom = course.maNhom || MA_NHOM || "GP01";
    const ngayTao = course.ngayTao || dayjs().format("DD/MM/YYYY");
    const taiKhoanNguoiTao = course.nguoiTao?.taiKhoan || user?.taiKhoan || "admin";
    const luotXem = course.luotXem || 0;

    try {
      if (selectedFile) {
        // Có tải file ảnh mới -> dùng API CapNhatKhoaHocUpload (FormData)
        const formData = new FormData();
        formData.append("maKhoaHoc", values.maKhoaHoc.trim());
        formData.append("biDanh", values.biDanh.trim());
        formData.append("tenKhoaHoc", values.tenKhoaHoc.trim());
        formData.append("moTa", values.moTa.trim());
        formData.append("luotXem", String(luotXem));
        formData.append("danhGia", "0");
        formData.append("hinhAnh", selectedFile, selectedFile.name);
        formData.append("maNhom", maNhom);
        formData.append("ngayTao", ngayTao);
        formData.append("maDanhMucKhoaHoc", values.maDanhMucKhoaHoc);
        formData.append("taiKhoanNguoiTao", taiKhoanNguoiTao);

        await updateCourseWithImageMutation.mutateAsync(formData);
      } else {
        // Không tải file mới -> dùng API CapNhatKhoaHoc (JSON body)
        const payload = {
          maKhoaHoc: values.maKhoaHoc.trim(),
          biDanh: values.biDanh.trim(),
          tenKhoaHoc: values.tenKhoaHoc.trim(),
          moTa: values.moTa.trim(),
          luotXem,
          danhGia: 0,
          hinhAnh: values.hinhAnhUrl?.trim() || course.hinhAnh || "",
          maNhom,
          ngayTao,
          maDanhMucKhoaHoc: values.maDanhMucKhoaHoc,
          taiKhoanNguoiTao,
        };

        await updateCourseMutation.mutateAsync(payload);
      }

      onOpenChange(false);
    } catch {
      // Đã xử lý toast lỗi trong hook mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Chỉnh sửa khóa học</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin chi tiết của khóa học. Mã khóa học không thể thay đổi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Hàng 1: Mã khóa học (Khóa cứng / Readonly) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="maKhoaHoc" className="flex items-center gap-1.5">
                Mã khóa học
                <Lock className="size-3.5 text-muted-foreground" />
              </Label>
              <span className="text-[11px] text-muted-foreground font-normal">
                (Khóa chính - Không được thay đổi)
              </span>
            </div>
            <Input
              id="maKhoaHoc"
              disabled
              className="bg-muted/70 cursor-not-allowed font-mono text-xs font-semibold"
              {...register("maKhoaHoc")}
            />
          </div>

          {/* Hàng 2: Tên khóa học */}
          <div className="space-y-1.5">
            <Label htmlFor="tenKhoaHoc">
              Tên khóa học <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tenKhoaHoc"
              placeholder="Nhập tên khóa học..."
              {...register("tenKhoaHoc")}
              onBlur={handleGenerateSlug}
            />
            {errors.tenKhoaHoc && (
              <p className="text-xs text-destructive">{errors.tenKhoaHoc.message}</p>
            )}
          </div>

          {/* Hàng 3: Bí danh & Danh mục */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="biDanh">
                Bí danh (Slug) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="biDanh"
                placeholder="VD: lap-trinh-reactjs"
                {...register("biDanh")}
              />
              {errors.biDanh && (
                <p className="text-xs text-destructive">{errors.biDanh.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="maDanhMucKhoaHoc">
                Danh mục khóa học <span className="text-destructive">*</span>
              </Label>
              <select
                id="maDanhMucKhoaHoc"
                {...register("maDanhMucKhoaHoc")}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isLoadingCategories}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                    {cat.tenDanhMuc} ({cat.maDanhMuc})
                  </option>
                ))}
              </select>
              {errors.maDanhMucKhoaHoc && (
                <p className="text-xs text-destructive">
                  {errors.maDanhMucKhoaHoc.message}
                </p>
              )}
            </div>
          </div>

          {/* Hàng 4: Mô tả khóa học */}
          <div className="space-y-1.5">
            <Label htmlFor="moTa">
              Mô tả khóa học <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="moTa"
              rows={3}
              placeholder="Nhập giới thiệu chi tiết về khóa học..."
              {...register("moTa")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            {errors.moTa && (
              <p className="text-xs text-destructive">{errors.moTa.message}</p>
            )}
          </div>

          {/* Hàng 5: Hình ảnh khóa học (Hiện ảnh cũ hoặc tải ảnh mới) */}
          <div className="space-y-2">
            <Label>Hình ảnh khóa học</Label>

            {previewUrl ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Ảnh khóa học"
                  className="size-full object-cover"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    onClick={() => fileInputRef.current?.click()}
                    className="shadow-sm text-xs h-7 gap-1"
                  >
                    <Upload className="size-3" />
                    <span>Đổi ảnh</span>
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-xs"
                    onClick={handleRemoveImage}
                    className="size-7 rounded-full shadow-md"
                    title="Xóa ảnh"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:border-primary/60 hover:bg-muted/30 transition-colors"
              >
                <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Upload className="size-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Nhấp để tải ảnh mới từ máy tính lên
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hỗ trợ file PNG, JPG, WEBP (Tối đa 3MB)
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

            {!selectedFile && (
              <div className="pt-1">
                <p className="text-xs text-muted-foreground mb-1">
                  Hoặc cập nhật đường dẫn URL ảnh trực tiếp:
                </p>
                <Input
                  placeholder="https://example.com/hinh-anh.jpg"
                  {...register("hinhAnhUrl")}
                  onChange={(e) => {
                    setValue("hinhAnhUrl", e.target.value);
                    if (e.target.value) setPreviewUrl(e.target.value);
                  }}
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-primary text-primary-foreground"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              <span>{isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
