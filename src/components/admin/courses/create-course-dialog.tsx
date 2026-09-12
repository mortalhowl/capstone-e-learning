"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import dayjs from "dayjs";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
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
  useCreateCourse,
  useCreateCourseWithImage,
} from "@/hooks/useCourses";
import { useAuthStore } from "@/stores/auth.store";
import { MA_NHOM } from "@/lib/constants";
import { slugify } from "@/lib/slugify";

// Schema validation cho Form tạo khóa học
const CourseFormSchema = z.object({
  maKhoaHoc: z
    .string()
    .min(1, "Mã khóa học không được để trống")
    .regex(/^[a-zA-Z0-9_-]+$/, "Mã khóa học chỉ được chứa chữ cái, số, gạch dưới hoặc gạch nối"),
  tenKhoaHoc: z.string().min(5, "Tên khóa học phải có tối thiểu 5 ký tự"),
  biDanh: z.string().min(1, "Bí danh không được để trống"),
  maDanhMucKhoaHoc: z.string().min(1, "Vui lòng chọn danh mục khóa học"),
  moTa: z.string().min(10, "Mô tả khóa học phải có tối thiểu 10 ký tự"),
  hinhAnhUrl: z.string().optional(),
});

type CourseFormValues = z.infer<typeof CourseFormSchema>;

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCourseDialog({
  open,
  onOpenChange,
}: CreateCourseDialogProps) {
  const user = useAuthStore((state) => state.user);
  const { data: categories = [], isLoading: isLoadingCategories } = useCourseCategories();

  const createCourseMutation = useCreateCourse();
  const createCourseWithImageMutation = useCreateCourseWithImage();

  // State quản lý file ảnh được chọn từ máy tính và ảnh xem trước (Preview)
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
  } = useForm<CourseFormValues>({
    resolver: zodResolver(CourseFormSchema),
    defaultValues: {
      maKhoaHoc: "",
      tenKhoaHoc: "",
      biDanh: "",
      maDanhMucKhoaHoc: "",
      moTa: "",
      hinhAnhUrl: "",
    },
  });

  const tenKhoaHoc = watch("tenKhoaHoc");

  // Tự động sinh Bí danh (Slug) khi người dùng nhập tên khóa học
  React.useEffect(() => {
    if (tenKhoaHoc) {
      const generatedSlug = slugify(tenKhoaHoc);
      setValue("biDanh", generatedSlug, { shouldValidate: true });
    }
  }, [tenKhoaHoc, setValue]);

  // Xử lý khi người dùng chọn file ảnh từ máy
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Giới hạn dung lượng ảnh tối đa 3MB
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Dung lượng ảnh tối đa là 3MB!");
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Dọn dẹp memory object url khi unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Reset form khi đóng dialog
  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      handleRemoveImage();
    }
    onOpenChange(newOpen);
  };

  const isSubmitting =
    createCourseMutation.isPending || createCourseWithImageMutation.isPending;

  // Xử lý Submit Form
  const onSubmit = async (values: CourseFormValues) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập với tài khoản Quản trị viên!");
      return;
    }

    const maNhom = MA_NHOM || "GP01";
    const ngayTao = dayjs().format("DD/MM/YYYY");
    const taiKhoanNguoiTao = user.taiKhoan;

    try {
      if (selectedFile) {
        // Trường hợp 1: Có chọn file ảnh từ máy -> Dùng API ThemKhoaHocUploadHinh (FormData)
        const formData = new FormData();
        formData.append("maKhoaHoc", values.maKhoaHoc.trim());
        formData.append("biDanh", values.biDanh.trim());
        formData.append("tenKhoaHoc", values.tenKhoaHoc.trim());
        formData.append("moTa", values.moTa.trim());
        formData.append("luotXem", "0");
        formData.append("danhGia", "0");
        formData.append("hinhAnh", selectedFile, selectedFile.name);
        formData.append("maNhom", maNhom);
        formData.append("ngayTao", ngayTao);
        formData.append("maDanhMucKhoaHoc", values.maDanhMucKhoaHoc);
        formData.append("taiKhoanNguoiTao", taiKhoanNguoiTao);

        await createCourseWithImageMutation.mutateAsync(formData);
      } else {
        // Trường hợp 2: Không chọn file ảnh -> Dùng API ThemKhoaHoc (JSON body)
        const payload = {
          maKhoaHoc: values.maKhoaHoc.trim(),
          biDanh: values.biDanh.trim(),
          tenKhoaHoc: values.tenKhoaHoc.trim(),
          moTa: values.moTa.trim(),
          luotXem: 0,
          danhGia: 0,
          hinhAnh: values.hinhAnhUrl?.trim() || "default-course.jpg",
          maNhom,
          ngayTao,
          maDanhMucKhoaHoc: values.maDanhMucKhoaHoc,
          taiKhoanNguoiTao,
        };

        await createCourseMutation.mutateAsync(payload);
      }

      handleClose(false);
    } catch {
      // Lỗi đã được xử lý hiển thị toast trong hook mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Tạo khóa học mới</DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin bên dưới để tạo khóa học mới trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Hàng 1: Tên khóa học */}
          <div className="space-y-1.5">
            <Label htmlFor="tenKhoaHoc">
              Tên khóa học <span className="text-destructive">*</span>
            </Label>
            <Input
              id="tenKhoaHoc"
              placeholder="VD: Lập trình ReactJS Pro từ cơ bản đến nâng cao"
              {...register("tenKhoaHoc")}
            />
            {errors.tenKhoaHoc && (
              <p className="text-xs text-destructive">{errors.tenKhoaHoc.message}</p>
            )}
          </div>

          {/* Hàng 2: Mã khóa học & Bí danh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="maKhoaHoc">
                Mã khóa học <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maKhoaHoc"
                placeholder="VD: REACT_PRO_01"
                {...register("maKhoaHoc")}
              />
              {errors.maKhoaHoc && (
                <p className="text-xs text-destructive">{errors.maKhoaHoc.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="biDanh">
                Bí danh (Slug) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="biDanh"
                placeholder="VD: react-pro-01"
                {...register("biDanh")}
              />
              {errors.biDanh && (
                <p className="text-xs text-destructive">{errors.biDanh.message}</p>
              )}
            </div>
          </div>

          {/* Hàng 3: Danh mục khóa học */}
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
              <option value="">-- Chọn danh mục khóa học --</option>
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

          {/* Hàng 4: Mô tả khóa học */}
          <div className="space-y-1.5">
            <Label htmlFor="moTa">
              Mô tả khóa học <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="moTa"
              rows={3}
              placeholder="Nhập giới thiệu chi tiết về nội dung và mục tiêu khóa học..."
              {...register("moTa")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            {errors.moTa && (
              <p className="text-xs text-destructive">{errors.moTa.message}</p>
            )}
          </div>

          {/* Hàng 5: Upload Hình ảnh hoặc Nhập URL */}
          <div className="space-y-2">
            <Label>Hình ảnh khóa học</Label>

            {previewUrl ? (
              <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Ảnh xem trước"
                  className="size-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-xs"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 size-7 rounded-full shadow-md"
                  title="Xóa ảnh"
                >
                  <X className="size-4" />
                </Button>
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
                    Nhấp để tải ảnh từ máy tính lên (Khuyến nghị)
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
                  Hoặc nhập đường dẫn URL ảnh (tùy chọn nếu không tải file):
                </p>
                <Input
                  placeholder="https://example.com/hinh-anh.jpg"
                  {...register("hinhAnhUrl")}
                  className="h-8 text-xs"
                />
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
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
              <span>{isSubmitting ? "Đang tạo..." : "Tạo khóa học"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
