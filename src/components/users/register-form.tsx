"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import {
  RegisterFormSchema,
  type RegisterForm,
  type RegisterPayload,
} from "@/schemas/user.schema";
import { useRegister } from "@/hooks/useUsers";
import { useUser } from "@/stores/auth.store";
import { AuthCard } from "@/components/shared/auth-card";
import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MA_NHOM } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const currentUser = useUser();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
      xacNhanMatKhau: "",
      hoTen: "",
      soDT: "",
      email: "",
      maNhom: MA_NHOM || "GP07",
    },
  });

  React.useEffect(() => {
    if (currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  const onSubmit = async (values: RegisterForm) => {
    const payload: RegisterPayload = {
      taiKhoan: values.taiKhoan.trim(),
      matKhau: values.matKhau,
      hoTen: values.hoTen.trim(),
      soDT: values.soDT.trim(),
      email: values.email.trim(),
      maNhom: values.maNhom || MA_NHOM || "GP07",
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Đăng ký tài khoản thành công!", {
          description: "Vui lòng đăng nhập với tài khoản vừa tạo để tiếp tục.",
        });
        router.push("/login");
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          toast.error(error.response?.data || "Đăng ký thất bại!");
        } else {
          toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
        }
      },
    });
  };

  if (currentUser) {
    return (
      <AuthCard
        title="Đang chuyển hướng..."
        description="Bạn đã đăng nhập vào hệ thống."
      >
        <div className="py-10 flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Đang chuyển bạn về trang chủ...
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Tạo tài khoản"
      description="Điền thông tin để bắt đầu học"
      footerText="Đã có tài khoản?"
      footerLinkText="Đăng nhập"
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="taiKhoan" className="text-sm font-medium text-foreground">
              Tài khoản <span className="text-destructive">*</span>
            </Label>
            <Input
              id="taiKhoan"
              placeholder="Nhập tài khoản..."
              autoComplete="username"
              disabled={registerMutation.isPending}
              aria-invalid={!!errors.taiKhoan}
              className={cn(
                "h-10 px-3.5 text-sm",
                errors.taiKhoan && "border-destructive focus-visible:ring-destructive/30"
              )}
              {...register("taiKhoan")}
            />
            {errors.taiKhoan && (
              <p className="text-xs text-destructive font-medium pt-0.5">
                {errors.taiKhoan.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="hoTen" className="text-sm font-medium text-foreground">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hoTen"
              placeholder="Nhập họ và tên..."
              autoComplete="name"
              disabled={registerMutation.isPending}
              aria-invalid={!!errors.hoTen}
              className={cn(
                "h-10 px-3.5 text-sm",
                errors.hoTen && "border-destructive focus-visible:ring-destructive/30"
              )}
              {...register("hoTen")}
            />
            {errors.hoTen && (
              <p className="text-xs text-destructive font-medium pt-0.5">
                {errors.hoTen.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              disabled={registerMutation.isPending}
              aria-invalid={!!errors.email}
              className={cn(
                "h-10 px-3.5 text-sm",
                errors.email && "border-destructive focus-visible:ring-destructive/30"
              )}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive font-medium pt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="soDT" className="text-sm font-medium text-foreground">
              Số điện thoại <span className="text-destructive">*</span>
            </Label>
            <Input
              id="soDT"
              type="tel"
              placeholder="0912 345 678"
              autoComplete="tel"
              disabled={registerMutation.isPending}
              aria-invalid={!!errors.soDT}
              className={cn(
                "h-10 px-3.5 text-sm",
                errors.soDT && "border-destructive focus-visible:ring-destructive/30"
              )}
              {...register("soDT")}
            />
            {errors.soDT && (
              <p className="text-xs text-destructive font-medium pt-0.5">
                {errors.soDT.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="matKhau" className="text-sm font-medium text-foreground">
            Mật khẩu <span className="text-destructive">*</span>
          </Label>
          <PasswordInput
            id="matKhau"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={registerMutation.isPending}
            aria-invalid={!!errors.matKhau}
            className={cn(
              errors.matKhau && "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("matKhau")}
          />
          {errors.matKhau && (
            <p className="text-xs text-destructive font-medium pt-0.5">
              {errors.matKhau.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="xacNhanMatKhau" className="text-sm font-medium text-foreground">
            Xác nhận mật khẩu <span className="text-destructive">*</span>
          </Label>
          <PasswordInput
            id="xacNhanMatKhau"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={registerMutation.isPending}
            aria-invalid={!!errors.xacNhanMatKhau}
            className={cn(
              errors.xacNhanMatKhau && "border-destructive focus-visible:ring-destructive/30"
            )}
            {...register("xacNhanMatKhau")}
          />
          {errors.xacNhanMatKhau && (
            <p className="text-xs text-destructive font-medium pt-0.5">
              {errors.xacNhanMatKhau.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-10 font-semibold text-sm transition-all shadow-md shadow-primary/20 hover:shadow-primary/30 mt-2"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Đang tạo tài khoản...
            </>
          ) : (
            "Đăng ký"
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
