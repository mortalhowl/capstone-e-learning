"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, BookOpen, GraduationCap, Users, PlayCircle, Award } from "lucide-react";

import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push("/courses");
      return;
    }
    router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleScrollToFeatured = () => {
    const element = document.getElementById("featured-courses");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-primary/5 via-background to-background py-12 md:py-20 lg:py-24 border-b border-border/40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary shadow-xs">
              <Sparkles className="size-3.5" />
              <span>Nền tảng học lập trình hàng đầu</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Học mọi nơi, <br className="hidden sm:inline" />
                <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  mọi lúc
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Khám phá hàng ngàn khóa học chất lượng cao được thiết kế bài bản, giúp bạn nhanh chóng làm chủ kỹ năng lập trình và phát triển sự nghiệp vững vàng.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="relative max-w-xl mx-auto lg:mx-0 flex items-center shadow-md shadow-primary/5 rounded-xl border border-border/80 bg-background transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            >
              <Search className="size-5 text-muted-foreground ml-4 shrink-0 pointer-events-none" />
              <Input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 text-sm sm:text-base h-12 sm:h-14 pl-3 pr-24 bg-transparent"
              />
              <button
                type="submit"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "absolute right-2 h-9 sm:h-10 px-4 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer"
                )}
              >
                Tìm kiếm
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/courses"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 sm:h-12 px-6 rounded-lg text-sm sm:text-base font-semibold shadow-md shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                Khám phá ngay
              </Link>
              <button
                type="button"
                onClick={handleScrollToFeatured}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 sm:h-12 px-6 rounded-lg text-sm sm:text-base font-medium flex items-center gap-2 cursor-pointer transition-all hover:bg-muted"
                )}
              >
                <PlayCircle className="size-4 text-primary" />
                <span>Xem demo</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[460px] aspect-4/3 rounded-2xl bg-linear-to-br from-primary/15 via-primary/5 to-muted border border-border/80 p-6 sm:p-8 flex flex-col justify-between shadow-xl overflow-hidden group">
              <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-primary/15 blur-3xl" />

              <div className="flex items-center justify-between z-10">
                <div className="size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
                  <GraduationCap className="size-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-xs font-semibold text-foreground">
                  <Award className="size-3.5 text-amber-500" />
                  <span>Chứng chỉ uy tín</span>
                </div>
              </div>

              <div className="space-y-3 z-10 my-6">
                <div className="inline-block px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  CyberSoft E-Learning
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight">
                  Lộ trình học tập thực chiến từ cơ bản tới nâng cao
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Hơn 200+ bài giảng video chất lượng cao với giảng viên giàu kinh nghiệm.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 z-10 pt-4 border-t border-border/40">
                <div className="flex items-center gap-2.5 bg-background/70 backdrop-blur-md p-2.5 rounded-lg border border-border/40">
                  <Users className="size-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">10,000+</p>
                    <p className="text-[10px] text-muted-foreground">Học viên</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-background/70 backdrop-blur-md p-2.5 rounded-lg border border-border/40">
                  <BookOpen className="size-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-foreground">200+</p>
                    <p className="text-[10px] text-muted-foreground">Khóa học</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
