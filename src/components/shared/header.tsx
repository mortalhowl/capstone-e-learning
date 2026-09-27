"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { useAuthStore } from "@/stores/auth.store";
import { ToggleTheme } from "@/components/shared/toggle-theme";
import { UserNav } from "@/components/shared/user-nav";
import { MobileNav } from "@/components/shared/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function Header() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isHydrated = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Khóa học", href: "/courses" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <MobileNav user={isHydrated ? user : null} />

          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 group-hover:bg-primary/90 transition-colors">
              <GraduationCap className="size-5" />
            </div>
            <div className="flex items-center gap-1.5 font-bold text-lg sm:text-xl tracking-tight text-foreground">
              <span>E-Learning</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground relative py-1",
                  isActive
                    ? "text-foreground font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <ToggleTheme />

          {!isHydrated ? (
            <Skeleton className="size-9 rounded-full" />
          ) : user ? (
            <UserNav user={user} />
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-9 px-3.5 text-sm font-medium"
                )}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "h-9 px-4 text-sm font-semibold shadow-xs"
                )}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
