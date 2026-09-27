import * as React from "react";
import { Users, BookOpen, GraduationCap, ThumbsUp } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      value: "10,000+",
      label: "Học viên",
      icon: Users,
    },
    {
      value: "200+",
      label: "Khóa học",
      icon: BookOpen,
    },
    {
      value: "50+",
      label: "Giảng viên",
      icon: GraduationCap,
    },
    {
      value: "95%",
      label: "Hài lòng",
      icon: ThumbsUp,
    },
  ];

  return (
    <section className="py-14 sm:py-16 border-t border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border/60 shadow-2xs text-center space-y-2 group hover:border-primary/40 transition-colors"
              >
                <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="size-5" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
