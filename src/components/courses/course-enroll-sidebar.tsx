"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  CheckCircle2,
  Video,
  Award,
  BookOpen,
  UserCheck,
  Loader2,
  UserX,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import type { Course } from "@/schemas/course.schema";
import { useAuthStore } from "@/stores/auth.store";
import { useProfile } from "@/hooks/useUsers";
import { useCourseRegister, useUnenroll } from "@/hooks/useCourses";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CourseEnrollSidebarProps {
  course: Course;
}

export function CourseEnrollSidebar({ course }: CourseEnrollSidebarProps) {
  const router = useRouter();
  const params = useParams();
  const user = useAuthStore((state) => state.user);
  const { data: profile, isLoading: isLoadingProfile } = useProfile(Boolean(user));
  const registerMutation = useCourseRegister();
  const unenrollMutation = useUnenroll();
  const [isConfirmUnenrollOpen, setIsConfirmUnenrollOpen] = React.useState(false);

  const [imgSrc, setImgSrc] = React.useState<string>(course.hinhAnh);
  const [imgError, setImgError] = React.useState(false);

  const isEnrolled = React.useMemo(() => {
    if (!profile?.chiTietKhoaHocGhiDanh) return false;
    return profile.chiTietKhoaHocGhiDanh.some(
      (item) => item.maKhoaHoc === course.maKhoaHoc
    );
  }, [profile, course.maKhoaHoc]);

  const handleEnroll = async () => {
    if (!user) {
      toast.info("Vui lòng đăng nhập để đăng ký khóa học này!");
      router.push(`/login?callbackUrl=/courses/${course.maKhoaHoc}`);
      return;
    }

    registerMutation.mutate({
      maKhoaHoc: course.maKhoaHoc,
      taiKhoan: user.taiKhoan,
    });
  };

  // 13.1.5: Hủy ghi danh (maKhoaHoc từ param url, taiKhoan từ localStorage sau khi đăng nhập)
  const handleUnenroll = async () => {
    // 1. maKhoaHoc: Lấy từ param URL
    const rawCourseId = (params?.id as string) || course.maKhoaHoc;
    const maKhoaHoc = decodeURIComponent(rawCourseId);

    // 2. taiKhoan: Lấy từ localStorage sau khi đăng nhập (auth-storage hoặc USER_LOGIN)
    let taiKhoan = user?.taiKhoan;
    if (!taiKhoan && typeof window !== "undefined") {
      try {
        const rawAuth = localStorage.getItem("auth-storage");
        if (rawAuth) {
          const parsed = JSON.parse(rawAuth);
          taiKhoan = parsed?.state?.user?.taiKhoan;
        }
        if (!taiKhoan) {
          const rawUserLogin = localStorage.getItem("USER_LOGIN");
          if (rawUserLogin) {
            const parsed = JSON.parse(rawUserLogin);
            taiKhoan = parsed?.taiKhoan;
          }
        }
      } catch (err) {
        console.error("Error reading taiKhoan from localStorage", err);
      }
    }

    if (!taiKhoan) {
      toast.error("Không tìm thấy thông tin tài khoản đăng nhập trong localStorage!");
      return;
    }

    try {
      await unenrollMutation.mutateAsync({
        maKhoaHoc,
        taiKhoan,
      });
      setIsConfirmUnenrollOpen(false);
    } catch {
      // Handled in mutation onError
    }
  };

  const benefits = [
    { text: "Học tập linh hoạt mọi lúc mọi nơi", icon: Video },
    { text: "Hơn 30 bài giảng thực chiến", icon: BookOpen },
    { text: "Hỗ trợ giải đáp từ giảng viên", icon: UserCheck },
    { text: "Chứng nhận hoàn thành khóa học", icon: Award },
  ];

  return (
    <>
      <div className="sticky top-24 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-md space-y-6">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted border border-border/50">
        {!imgError ? (
          <Image
            src={imgSrc}
            alt={course.tenKhoaHoc}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 380px"
            className="object-cover"
            onError={() => {
              setImgError(true);
              setImgSrc("");
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted/60 text-muted-foreground p-4 text-center">
            <span className="font-bold text-sm tracking-wider uppercase opacity-70">
              CyberSoft
            </span>
            <span className="text-xs line-clamp-1 mt-1 font-medium text-foreground/80">
              {course.tenKhoaHoc}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {isEnrolled ? (
          <div className="space-y-3">
            <div className="w-full h-11 text-sm font-semibold bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4.5" />
              <span>Đã ghi danh khóa học</span>
            </div>
            <p className="text-[11px] text-center text-muted-foreground">
              Bạn đã tham gia khóa học này. Hãy vào hồ sơ để bắt đầu học!
            </p>
            <Button
              variant="outline"
              onClick={() => setIsConfirmUnenrollOpen(true)}
              disabled={unenrollMutation.isPending}
              className="w-full h-9 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 gap-1.5 cursor-pointer"
            >
              {unenrollMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <UserX className="size-3.5" />
              )}
              <span>Hủy ghi danh khóa học</span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleEnroll}
            disabled={registerMutation.isPending || isLoadingProfile}
            className="w-full h-11 text-sm font-semibold shadow-md shadow-primary/20 cursor-pointer transition-transform active:scale-[0.98]"
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Đăng ký ngay</span>
            )}
          </Button>
        )}

        <div className="pt-4 border-t border-border/50 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Khóa học bao gồm:
          </p>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            {benefits.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={i} className="flex items-center gap-2.5">
                  <Icon className="size-4 text-primary shrink-0" />
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>

    {/* Modal xác nhận hủy ghi danh (Chức năng 13.1.5) */}
    <Dialog open={isConfirmUnenrollOpen} onOpenChange={setIsConfirmUnenrollOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="size-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Xác nhận hủy ghi danh
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Bạn có chắc chắn muốn hủy ghi danh khỏi khóa học{" "}
            <strong className="text-foreground font-semibold">&ldquo;{course.tenKhoaHoc}&rdquo;</strong>{" "}
            không? Tiến độ học tập của bạn tại khóa học này có thể bị mất.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsConfirmUnenrollOpen(false)}
            disabled={unenrollMutation.isPending}
          >
            Giữ lại
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleUnenroll}
            disabled={unenrollMutation.isPending}
            className="gap-1.5"
          >
            {unenrollMutation.isPending && <Loader2 className="size-3.5 animate-spin" />}
            <span>Hủy ghi danh</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
}
