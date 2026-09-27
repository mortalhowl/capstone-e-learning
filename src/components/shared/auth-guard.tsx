"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "GV" | "HV";
  redirectTo?: string;
}

const emptySubscribe = () => () => {};

export function AuthGuard({
  children,
  requiredRole,
  redirectTo,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  React.useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      const targetUrl =
        redirectTo || `/login?callbackUrl=${encodeURIComponent(pathname)}`;
      router.replace(targetUrl);
      return;
    }

    if (requiredRole && user.maLoaiNguoiDung !== requiredRole) {
      toast.error("Truy cập bị từ chối", {
        description: "Bạn không có quyền truy cập vào khu vực quản trị!",
      });
      router.replace("/");
    }
  }, [isHydrated, isAuthenticated, user, requiredRole, redirectTo, pathname, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang chuyển hướng đến trang đăng nhập...</p>
      </div>
    );
  }

  if (requiredRole && user.maLoaiNguoiDung !== requiredRole) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <ShieldAlert className="size-6" />
        </div>
        <h2 className="text-lg font-semibold">Truy cập bị từ chối</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          Tài khoản của bạn không đủ quyền hạn để truy cập trang này. Đang đưa bạn về trang chủ...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
