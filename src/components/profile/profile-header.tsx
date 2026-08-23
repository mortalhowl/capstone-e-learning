"use client";

import * as React from "react";
import { Mail, Phone, ShieldCheck, UserCircle, Edit3 } from "lucide-react";

import type { Profile } from "@/schemas/user.schema";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  profile: Profile;
  onEditClick: () => void;
}

export function ProfileHeader({ profile, onEditClick }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isTeacher = profile.maLoaiNguoiDung === "GV";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar className="size-20 sm:size-24 border-2 border-primary/20 shadow-md">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl tracking-wider">
              {getInitials(profile.hoTen)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {profile.hoTen}
              </h1>
              <Badge
                variant={isTeacher ? "default" : "secondary"}
                className="text-xs px-2.5 py-0.5 font-semibold"
              >
                <ShieldCheck className="size-3.5 mr-1" />
                {isTeacher ? "Giảng viên" : "Học viên"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium text-foreground/80">
                <UserCircle className="size-4 text-muted-foreground" />
                <span>@{profile.taiKhoan}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="size-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              {profile.soDT && (
                <div className="flex items-center gap-1.5">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{profile.soDT}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onEditClick}
          className="h-9 px-3.5 text-xs font-semibold flex items-center gap-2 cursor-pointer self-stretch sm:self-auto"
        >
          <Edit3 className="size-3.5" />
          <span>Chỉnh sửa thông tin</span>
        </Button>
      </div>
    </div>
  );
}
