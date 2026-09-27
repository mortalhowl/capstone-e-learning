"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Mail, PhoneCall, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  const quickLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Khóa học", href: "/courses" },
  ];

  return (
    <footer className="w-full bg-muted/40 border-t border-border/50 text-foreground transition-colors">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02] active:scale-[0.98] w-fit"
            >
              <div className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 group-hover:bg-primary/90 transition-colors">
                <GraduationCap className="size-5" />
              </div>
              <div className="flex items-center gap-1.5 font-bold text-lg sm:text-xl tracking-tight text-foreground">
                <span>E-Learning</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CyberSoft Academy - Hệ thống đào tạo lập trình thực chiến và kỹ năng số hàng đầu, cung cấp lộ trình bài bản từ cơ bản đến chuyên sâu cho học viên.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-primary/60">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Liên hệ
            </h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary shrink-0" />
                <a
                  href="mailto:info@cybersoft.edu.vn"
                  className="hover:text-foreground transition-colors"
                >
                  info@cybersoft.edu.vn
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="size-4 text-primary shrink-0" />
                <a
                  href="tel:18001234"
                  className="hover:text-foreground transition-colors"
                >
                  1800 1234
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <span>112 Cao Thắng, Quận 3, TP.HCM</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Mạng xã hội
            </h3>
            <p className="text-xs text-muted-foreground">
              Theo dõi các kênh truyền thông chính thức để cập nhật kiến thức và học bổng mới nhất.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/lophocviet"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook CyberSoft"
                className="size-10 rounded-lg bg-background border border-border/80 flex items-center justify-center text-muted-foreground hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 transition-all shadow-2xs"
              >
                <svg className="size-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@CyberSoftAcademy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube CyberSoft"
                className="size-10 rounded-lg bg-background border border-border/80 flex items-center justify-center text-muted-foreground hover:text-[#FF0000] hover:border-[#FF0000]/50 hover:bg-[#FF0000]/10 transition-all shadow-2xs"
              >
                <svg className="size-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 opacity-60" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground text-center sm:text-left">
          <p>© 2026 CyberSoft E-Learning. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">
              Điều khoản sử dụng
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-foreground transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
