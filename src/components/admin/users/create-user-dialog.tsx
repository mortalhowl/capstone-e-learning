"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, UserPlus, Shield, GraduationCap } from "lucide-react";
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
import { useCreateUser } from "@/hooks/useUsers";
import { MA_NHOM } from "@/lib/constants";
import { CreateUserSchema, type CreateUserPayload } from "@/schemas/user.schema";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
}: CreateUserDialogProps) {
  const createUserMutation = useCreateUser();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserPayload>({
    resolver: zodResolver(CreateUserSchema),
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

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setShowPassword(false);
    }
    onOpenChange(newOpen);
  };

  const isSubmitting = createUserMutation.isPending;

  const onSubmit = async (values: CreateUserPayload) => {
    try {
      const payload: CreateUserPayload = {
        taiKhoan: values.taiKhoan.trim(),
        matKhau: values.matKhau,
        hoTen: values.hoTen.trim(),
        email: values.email.trim(),
        soDT: values.soDT.trim(),
        maLoaiNguoiDung: values.maLoaiNguoiDung,
        maNhom: MA_NHOM || "GP01",
      };

      await createUserMutation.mutateAsync(payload);
      handleClose(false);
    } catch {
      // Toast lỗi đã được xử lý trong hook mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            <span>Thêm người dùng mới</span>
          </DialogTitle>
          <DialogDescription>
            Tạo tài khoản người dùng mới và phân quyền vai trò (Học viên hoặc Giáo vụ).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Hàng 1: Tài khoản & Mật khẩu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="taiKhoan">
                Tài khoản <span className="text-destructive">*</span>
              </Label>
              <Input
                id="taiKhoan"
                placeholder="VD: nguyenvana"
                {...register("taiKhoan")}
              />
              {errors.taiKhoan && (
                <p className="text-xs text-destructive">{errors.taiKhoan.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="matKhau">
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="matKhau"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 5 ký tự"
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
            <Label htmlFor="hoTen">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hoTen"
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
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="VD: vana@gmail.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="soDT">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="soDT"
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
            <Label htmlFor="maLoaiNguoiDung">
              Vai trò / Phân quyền <span className="text-destructive">*</span>
            </Label>
            <select
              id="maLoaiNguoiDung"
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
              <span>{isSubmitting ? "Đang tạo..." : "Tạo người dùng"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
