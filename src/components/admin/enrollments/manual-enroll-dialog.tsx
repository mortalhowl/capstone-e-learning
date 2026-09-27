"use client";

import * as React from "react";
import { Search, UserPlus, Loader2, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Student } from "@/schemas/course.schema";

interface ManualEnrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  courseName: string;
  unenrolledUsers?: Student[];
  isLoading?: boolean;
  onEnroll: (taiKhoan: string) => Promise<void>;
  isEnrolling?: boolean;
}

export function ManualEnrollDialog({
  open,
  onOpenChange,
  courseId,
  courseName,
  unenrolledUsers = [],
  isLoading,
  onEnroll,
  isEnrolling,
}: ManualEnrollDialogProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [processingUser, setProcessingUser] = React.useState<string | null>(null);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const filteredUsers = React.useMemo(() => {
    if (!searchTerm.trim()) return unenrolledUsers;
    const term = searchTerm.toLowerCase();
    return unenrolledUsers.filter(
      (u) =>
        u.hoTen?.toLowerCase().includes(term) ||
        u.taiKhoan?.toLowerCase().includes(term) ||
        u.biDanh?.toLowerCase().includes(term)
    );
  }, [unenrolledUsers, searchTerm]);

  const handleEnroll = async (taiKhoan: string) => {
    setProcessingUser(taiKhoan);
    try {
      await onEnroll(taiKhoan);
    } finally {
      setProcessingUser(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3 border-b">
          <DialogTitle className="text-lg flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            <span>Ghi danh học viên vào khóa học</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
            <BookOpen className="size-3.5 shrink-0" />
            <span className="truncate font-medium text-foreground">
              {courseName} ({courseId})
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Ô tìm kiếm học viên */}
        <div className="p-4 border-b bg-muted/20">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo họ tên hoặc tài khoản người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-input bg-background text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Danh sách người dùng khả dụng để ghi danh */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[380px]">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Đang tải danh sách người dùng khả dụng...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {searchTerm
                ? `Không tìm thấy người dùng nào khớp với "${searchTerm}".`
                : "Tất cả học viên trong hệ thống đã được ghi danh vào khóa học này."}
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isCurrentProcessing = processingUser === user.taiKhoan;

              return (
                <div
                  key={user.taiKhoan}
                  className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <Avatar className="size-9 border shrink-0">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                        {getInitials(user.hoTen)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-foreground truncate" title={user.hoTen}>
                        {user.hoTen}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        @{user.taiKhoan}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleEnroll(user.taiKhoan)}
                    disabled={Boolean(processingUser) || isEnrolling}
                    className="h-8 px-3 gap-1.5 text-xs shrink-0"
                  >
                    {isCurrentProcessing && isEnrolling ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="size-3.5" />
                    )}
                    <span>Ghi danh</span>
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
