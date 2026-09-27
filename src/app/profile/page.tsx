"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, User, Loader2 } from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";
import { useProfile } from "@/hooks/useUsers";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileEnrolledCourses } from "@/components/profile/profile-enrolled-courses";
import { ProfileAccountForm } from "@/components/profile/profile-account-form";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export default function ProfilePageWrapper() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto px-4 py-10 max-w-6xl space-y-6">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="grid lg:grid-cols-12 gap-8">
            <Skeleton className="lg:col-span-4 h-48 rounded-xl" />
            <Skeleton className="lg:col-span-8 h-96 rounded-xl" />
          </div>
        </div>
      }
    >
      <ProfilePage />
    </React.Suspense>
  );
}

function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "my-courses";

  const user = useAuthStore((state) => state.user);
  const isHydrated = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isAuthenticated = isHydrated && Boolean(user);

  React.useEffect(() => {
    if (isHydrated && !user) {
      router.push("/login?callbackUrl=/profile");
    }
  }, [isHydrated, user, router]);

  const { data: profile, isLoading } = useProfile(isAuthenticated);

  const handleTabChange = (tab: "my-courses" | "account") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/profile?${params.toString()}`);
  };

  if (!isHydrated || isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-36 w-full rounded-xl" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const enrolledCount = profile.chiTietKhoaHocGhiDanh?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-6xl space-y-8">
      <ProfileHeader
        profile={profile}
        onEditClick={() => handleTabChange("account")}
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4 rounded-2xl border border-border/70 bg-card p-3 shadow-2xs space-y-1.5 sticky top-24">
          <button
            type="button"
            onClick={() => handleTabChange("my-courses")}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left",
              activeTabParam === "my-courses"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="size-4.5" />
              <span>Khóa học của tôi</span>
            </div>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-bold",
                activeTabParam === "my-courses"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {enrolledCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("account")}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left",
              activeTabParam === "account"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <User className="size-4.5" />
              <span>Thông tin tài khoản</span>
            </div>
          </button>
        </aside>

        <main className="lg:col-span-8 rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-2xs">
          {activeTabParam === "my-courses" ? (
            <ProfileEnrolledCourses
              courses={profile.chiTietKhoaHocGhiDanh || []}
              username={profile.taiKhoan}
            />
          ) : (
            <ProfileAccountForm profile={profile} />
          )}
        </main>
      </div>
    </div>
  );
}
