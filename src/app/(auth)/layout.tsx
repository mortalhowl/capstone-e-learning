import * as React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { ToggleTheme } from "@/components/shared/toggle-theme";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-primary/20 selection:text-primary transition-colors">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent blur-3xl opacity-70 dark:opacity-30" />
      </div>

      <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
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

          <div className="flex items-center gap-3">
            <ToggleTheme />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {children}
      </main>

      <footer className="w-full py-6 text-center text-xs text-muted-foreground/80 px-4">
        <p>
          Bằng việc tiếp tục, bạn đồng ý với{" "}
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Chính sách bảo mật
          </Link>
        </p>
      </footer>
    </div>
  );
}
