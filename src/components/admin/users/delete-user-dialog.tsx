"use client";

import * as React from "react";
import { AlertTriangle, Loader2, Trash2, ShieldCheck, GraduationCap } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeleteUser } from "@/hooks/useUsers";
import type { UserItem } from "@/schemas/user.schema";

interface DeleteUserDialogProps {
  user: UserItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const deleteUserMutation = useDeleteUser();

  if (!user) return null;

  const isDeleting = deleteUserMutation.isPending;
  const isTeacher = user.maLoaiNguoiDung === "GV";
  const phone = user.soDt || user.soDT || "—";

  const handleConfirmDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(user.taiKhoan);
      onOpenChange(false);
    } catch {
      // Toast thông báo lỗi đã được xử lý tự động trong hook useDeleteUser
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="gap-2">
          <div className="size-11 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <AlertTriangle className="size-6" />
          </div>
          <DialogTitle className="text-lg text-foreground">
            Xác nhận xóa tài khoản người dùng?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            Hành động này <strong className="text-destructive">không thể hoàn tác</strong>.
            Tài khoản người dùng sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu của hệ thống.
          </DialogDescription>
        </DialogHeader>

        {/* Thông tin chi tiết người dùng bị xóa */}
        <div className="rounded-lg border bg-muted/40 p-3.5 space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Tài khoản:</span>
            <Badge variant="outline" className="font-mono text-xs font-semibold">
              @{user.taiKhoan}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Họ và tên:</span>
            <span className="font-medium text-foreground text-sm">
              {user.hoTen}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Email:</span>
            <span className="text-muted-foreground text-xs font-mono">
              {user.email}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Số điện thoại:</span>
            <span className="text-muted-foreground text-xs">
              {phone}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Vai trò:</span>
            {isTeacher ? (
              <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-medium text-xs gap-1">
                <ShieldCheck className="size-3" />
                <span>Giáo vụ (Admin)</span>
              </Badge>
            ) : (
              <Badge variant="secondary" className="font-normal text-xs gap-1">
                <GraduationCap className="size-3 text-muted-foreground" />
                <span>Học viên</span>
              </Badge>
            )}
          </div>

          {isTeacher && (
            <div className="pt-2 border-t border-border/60 text-xs text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ Cảnh báo: Bạn đang yêu cầu xóa tài khoản <strong>Giáo vụ (Admin)</strong>. Hãy chắc chắn trước khi thực hiện.
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            <span>{isDeleting ? "Đang xóa..." : "Xác nhận xóa"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
