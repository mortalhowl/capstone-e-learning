"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, UserCog, Lock } from "lucide-react";

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
import { useUpdateUser } from "@/hooks/useUsers";
import { MA_NHOM } from "@/lib/constants";
import {
  EditUserSchema,
  type EditUserPayload,
  type UserItem,
} from "@/schemas/user.schema";

interface EditUserDialogProps {
  user: UserItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const updateUserMutation = useUpdateUser();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserPayload>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
      hoTen: "",
      email: "",
      soDT: "",
      maLoaiNguoiDung: "HV",
      maNhom: MA_NHOM || "GP01",
    },
  });

  // Điền dữ liệu người dùng khi mở modal hoặc khi user thay đổi
  React.useEffect(() => {
    if (user && open) {
      reset({
        taiKhoan: user.taiKhoan || "",
        matKhau: "",
        hoTen: user.hoTen || "",
        email: user.email || "",
        soDT: user.soDt || user.soDT || "",
        maLoaiNguoiDung: user.maLoaiNguoiDung || "HV",
        maNhom: MA_NHOM || "GP01",
      });
      setShowPassword(false);
    }
  }, [user, open, reset]);

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setShowPassword(false);
    }
    onOpenChange(newOpen);
  };

  const isSubmitting = updateUserMutation.isPending;

  const onSubmit = async (values: EditUserPayload) => {
    try {
      const payload: EditUserPayload = {
        taiKhoan: values.taiKhoan.trim(),
        matKhau: values.matKhau,
        hoTen: values.hoTen.trim(),
        email: values.email.trim(),
        soDT: values.soDT.trim(),
        maLoaiNguoiDung: values.maLoaiNguoiDung,
        maNhom: MA_NHOM || "GP01",
      };

      await updateUserMutation.mutateAsync(payload);
      handleClose(false);
    } catch {
      // Toast lỗi đã được xử lý trong hook useUpdateUser
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <UserCog className="size-5 text-primary" />
            <span>Chỉnh sửa thông tin người dùng</span>
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân và vai trò cho tài khoản{" "}
            <span className="font-semibold text-foreground font-mono">
              @{user?.taiKhoan}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Hàng 1: Tài khoản (Readonly) & Mật khẩu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit-taiKhoan">Tài khoản</Label>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Lock className="size-3" /> Cố định
                </span>
              </div>
              <Input
                id="edit-taiKhoan"
                readOnly
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed font-mono"
                {...register("taiKhoan")}
              />
              {errors.taiKhoan && (
                <p className="text-xs text-destructive">{errors.taiKhoan.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-matKhau">
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="edit-matKhau"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu (tối thiểu 5 ký tự)"
                  className="pr-9"
                  {...register("matKhau")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.matKhau && (
                <p className="text-xs text-destructive">{errors.matKhau.message}</p>
              )}
            </div>
          </div>

          {/* Hàng 2: Họ và tên */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-hoTen">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-hoTen"
              placeholder="VD: Nguyễn Văn A"
              {...register("hoTen")}
            />
            {errors.hoTen && (
              <p className="text-xs text-destructive">{errors.hoTen.message}</p>
            )}
          </div>

          {/* Hàng 3: Email & Số điện thoại */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="VD: vana@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-soDT">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-soDT"
                placeholder="VD: 0912345678"
                {...register("soDT")}
              />
              {errors.soDT && (
                <p className="text-xs text-destructive">{errors.soDT.message}</p>
              )}
            </div>
          </div>

          {/* Hàng 4: Phân quyền vai trò người dùng (maLoaiNguoiDung) */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-maLoaiNguoiDung">
              Vai trò / Phân quyền <span className="text-destructive">*</span>
            </Label>
            <select
              id="edit-maLoaiNguoiDung"
              {...register("maLoaiNguoiDung")}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="HV">Học viên (HV) - Người học khóa học</option>
              <option value="GV">Giáo vụ (GV) - Quản trị viên hệ thống</option>
            </select>
            {errors.maLoaiNguoiDung && (
              <p className="text-xs text-destructive">
                {errors.maLoaiNguoiDung.message}
              </p>
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
              <span>{isSubmitting ? "Đang lưu..." : "Cập nhật"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
