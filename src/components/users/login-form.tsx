"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isAxiosError } from "axios";

import { LoginSchema, type LoginPayload } from "@/schemas/user.schema";
import { useLogin } from "@/hooks/useUsers";
import { useUser } from "@/stores/auth.store";
import { AuthCard } from "@/components/shared/auth-card";
import { PasswordInput } from "@/components/shared/password-input";
import { GoogleButton } from "@/components/shared/google-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const currentUser = useUser();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      taiKhoan: "",
      matKhau: "",
    },
  });

  // Nếu đã đăng nhập, chuyển hướng ngay về trang chủ (không cho vào trang login)
  React.useEffect(() => {
    if (currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  const onSubmit = async (values: LoginPayload) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Đăng nhập thành công!", {
          description: "Chào mừng bạn quay trở lại với hệ thống.",
        });
        router.push("/");
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          const serverMessage =
            error.response?.data?.content ||
            error.response?.data?.message ||
            error.response?.data;

          toast.error("Đăng nhập thất bại", {
            description:
              typeof serverMessage === "string"
                ? serverMessage
                : "Tài khoản hoặc mật khẩu không chính xác!",
          });
        } else {
          toast.error("Đã xảy ra lỗi", {
            description: "Vui lòng kiểm tra kết nối mạng và thử lại sau.",
          });
        }
      },
    });
  };

  const handleGoogleLogin = () => {
    toast.info("Tính năng đang phát triển", {
      description: "Đăng nhập với Google sẽ sớm được hỗ trợ!",
    });
  };

  // Hiển thị trạng thái chuyển hướng nếu đã đăng nhập
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
      title="Đăng nhập"
      description="Chào mừng trở lại!"
      footerText="Chưa có tài khoản?"
      footerLinkText="Đăng ký ngay"
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Username Field */}
        <div className="space-y-1.5">
          <Label htmlFor="taiKhoan" className="text-sm font-medium text-foreground">
            Tài khoản
          </Label>
          <Input
            id="taiKhoan"
            placeholder="Nhập tài khoản..."
            autoComplete="username"
            disabled={loginMutation.isPending}
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

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="matKhau" className="text-sm font-medium text-foreground">
              Mật khẩu
            </Label>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Quên mật khẩu", {
                  description: "Vui lòng liên hệ quản trị viên để được hỗ trợ cấp lại mật khẩu.",
                });
              }}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <PasswordInput
            id="matKhau"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loginMutation.isPending}
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-10 font-semibold text-sm transition-all shadow-md shadow-primary/20 hover:shadow-primary/30"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>

      {/* Or Divider */}
      <div className="relative py-2 flex items-center justify-center">
        <Separator className="w-full" />
        <span className="absolute bg-card px-2 text-xs text-muted-foreground uppercase tracking-wider">
          hoặc
        </span>
      </div>

      {/* Google Login Button */}
      <GoogleButton onClick={handleGoogleLogin} disabled={loginMutation.isPending} />
    </AuthCard>
  );
}
