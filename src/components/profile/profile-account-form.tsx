"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, KeyRound, User, Mail, Phone } from "lucide-react";

import {
  UpdateProfileSchema,
  type UpdateProfileForm,
  type Profile,
} from "@/schemas/user.schema";
import { useUpdateProfile } from "@/hooks/useUsers";
import { PasswordInput } from "@/components/shared/password-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProfileAccountFormProps {
  profile: Profile;
}

export function ProfileAccountForm({ profile }: ProfileAccountFormProps) {
  const updateMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(UpdateProfileSchema),
    values: {
      taiKhoan: profile.taiKhoan,
      hoTen: profile.hoTen,
      email: profile.email,
      soDT: profile.soDT || "",
      matKhau: "",
      xacNhanMatKhau: "",
      maLoaiNguoiDung: profile.maLoaiNguoiDung || "HV",
      maNhom: profile.maNhom || "GP07",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const onSubmit = (data: UpdateProfileForm) => {
    const payload = {
      taiKhoan: profile.taiKhoan,
      hoTen: data.hoTen ? data.hoTen.trim() : profile.hoTen,
      email: data.email ? data.email.trim() : profile.email,
      soDT: data.soDT ? data.soDT.trim() : profile.soDT,
      matKhau:
        data.matKhau && data.matKhau.trim().length > 0
          ? data.matKhau.trim()
          : profile.matKhau,
      maLoaiNguoiDung: profile.maLoaiNguoiDung || "HV",
      maNhom: profile.maNhom || "GP07",
    };

    updateMutation.mutate(payload, {
      onSuccess: () => {
        reset({
          ...data,
          matKhau: "",
          xacNhanMatKhau: "",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-border/40">
        <h2 className="text-lg font-bold text-foreground">
          Thông tin tài khoản
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Cập nhật thông tin liên hệ và mật khẩu bảo mật của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="taiKhoan"
              className="text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              Tài khoản
            </Label>
            <div className="relative flex items-center">
              <User className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
              <Input
                id="taiKhoan"
                readOnly
                {...register("taiKhoan")}
                className="pl-9 h-10 text-sm bg-muted/50 cursor-not-allowed opacity-75 border-border/60 select-none"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tên tài khoản không thể thay đổi
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="hoTen"
              className="text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <div className="relative flex items-center">
              <User className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
              <Input
                id="hoTen"
                placeholder="Nhập họ và tên"
                {...register("hoTen")}
                className="pl-9 h-10 text-sm border-border/80"
              />
            </div>
            {errors.hoTen && (
              <p className="text-xs text-destructive">{errors.hoTen.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative flex items-center">
              <Mail className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                {...register("email")}
                className="pl-9 h-10 text-sm border-border/80"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="soDT"
              className="text-xs font-semibold uppercase tracking-wider text-foreground"
            >
              Số điện thoại <span className="text-destructive">*</span>
            </Label>
            <div className="relative flex items-center">
              <Phone className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
              <Input
                id="soDT"
                type="tel"
                placeholder="0912 345 678"
                {...register("soDT")}
                className="pl-9 h-10 text-sm border-border/80"
              />
            </div>
            {errors.soDT && (
              <p className="text-xs text-destructive">{errors.soDT.message}</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border/40 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <KeyRound className="size-4 text-primary" />
            <span>Đổi mật khẩu</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="matKhau"
                className="text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Mật khẩu mới
              </Label>
              <PasswordInput
                id="matKhau"
                placeholder="Để trống nếu không đổi mật khẩu"
                {...register("matKhau")}
                className="h-10 text-sm border-border/80"
              />
              {errors.matKhau && (
                <p className="text-xs text-destructive">
                  {errors.matKhau.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="xacNhanMatKhau"
                className="text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Xác nhận mật khẩu mới
              </Label>
              <PasswordInput
                id="xacNhanMatKhau"
                placeholder="Nhập lại mật khẩu mới"
                {...register("xacNhanMatKhau")}
                className="h-10 text-sm border-border/80"
              />
              {errors.xacNhanMatKhau && (
                <p className="text-xs text-destructive">
                  {errors.xacNhanMatKhau.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-10 px-6 text-sm font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
