"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { usePaginatedUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/use-debounce";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UserTable } from "@/components/admin/users/user-table";
import { UserPagination } from "@/components/admin/users/user-pagination";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import { EditUserDialog } from "@/components/admin/users/edit-user-dialog";
import { DeleteUserDialog } from "@/components/admin/users/delete-user-dialog";
import { Button } from "@/components/ui/button";
import type { UserItem } from "@/schemas/user.schema";

export default function AdminUsersPage() {
  // 1. Quản lý State: tìm kiếm, bộ lọc vai trò, phân trang và dialog tạo mới / chỉnh sửa / xóa
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [page, setPage] = React.useState<number>(1);
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false);
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<UserItem | null>(null);
  const pageSize = 10;

  // 2. Debounce từ khóa tìm kiếm (400ms)
  const debouncedSearch = useDebounce(searchTerm.trim(), 400);

  // 3. Reset về trang 1 khi từ khóa hoặc bộ lọc vai trò thay đổi
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  // 4. Gọi API LayDanhSachNguoiDung_PhanTrang
  const { data, isLoading, isFetching, error, refetch } = usePaginatedUsers(
    debouncedSearch,
    page,
    pageSize,
  );

  const rawUsers = data?.items || [];
  const totalPages = data?.totalPages || 0;
  const totalCount = data?.totalCount || 0;
  const currentPage = data?.currentPage || page;

  // Lọc theo vai trò phía Client (nếu có chọn)
  const users = React.useMemo(() => {
    if (roleFilter === "ALL") return rawUsers;
    return rawUsers.filter((user) => user.maLoaiNguoiDung === roleFilter);
  }, [rawUsers, roleFilter]);

  const handleResetSearch = () => {
    setSearchTerm("");
    setRoleFilter("ALL");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Quản lý người dùng
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Xem, tìm kiếm và quản lý toàn bộ tài khoản người dùng (Học viên & Giáo vụ) trong hệ thống E-Learning.
        </p>
      </div>

      {/* Thanh tìm kiếm & bộ lọc */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onResetSearch={handleResetSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        isLoading={isFetching}
        onRefresh={() => refetch()}
        totalCount={totalCount}
        onOpenCreateModal={() => setIsCreateOpen(true)}
      />

      {/* Thông báo lỗi nếu API gặp sự cố */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 shrink-0" />
            <span className="text-sm font-medium">
              Không thể tải danh sách người dùng. Vui lòng thử lại sau!
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-destructive/30 hover:bg-destructive/20 text-destructive h-8 gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            Thử lại
          </Button>
        </div>
      )}

      {/* Bảng danh sách người dùng */}
      <UserTable
        users={users}
        isLoading={isLoading}
        isFetching={isFetching}
        onResetSearch={handleResetSearch}
        isFiltered={Boolean(debouncedSearch || roleFilter !== "ALL")}
        onEditUser={setEditingUser}
        onDeleteUser={setDeletingUser}
      />

      {/* Thanh điều hướng phân trang */}
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={(newPage) => setPage(newPage)}
        disabled={isFetching}
      />

      {/* Modal Dialog Thêm người dùng mới */}
      <CreateUserDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      {/* Modal Dialog Chỉnh sửa người dùng */}
      <EditUserDialog
        user={editingUser}
        open={Boolean(editingUser)}
        onOpenChange={(open) => !open && setEditingUser(null)}
      />

      {/* Modal Dialog Xác nhận xóa người dùng */}
      <DeleteUserDialog
        user={deletingUser}
        open={Boolean(deletingUser)}
        onOpenChange={(open) => !open && setDeletingUser(null)}
      />
    </div>
  );
}


