"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { useSearchParams, useRouter } from "next/navigation";
import { usePaginatedUsers, useAllUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/use-debounce";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UserTable } from "@/components/admin/users/user-table";
import { UserPagination } from "@/components/admin/users/user-pagination";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import { EditUserDialog } from "@/components/admin/users/edit-user-dialog";
import { DeleteUserDialog } from "@/components/admin/users/delete-user-dialog";
import { UserEnrollmentDialog } from "@/components/admin/users/user-enrollment-dialog";
import { Button } from "@/components/ui/button";
import type { UserItem } from "@/schemas/user.schema";

function AdminUsersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleFilter = searchParams.get("role") || "ALL";

  // 1. Quản lý State: tìm kiếm, phân trang và dialog tạo mới / chỉnh sửa / xóa / ghi danh
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const [isCreateOpen, setIsCreateOpen] = React.useState<boolean>(false);
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null);
  const [deletingUser, setDeletingUser] = React.useState<UserItem | null>(null);
  const [enrollingUser, setEnrollingUser] = React.useState<UserItem | null>(null);
  const pageSize = 10;

  const handleRoleChange = (newRole: string) => {
    setPage(1);
    if (newRole === "ALL") {
      router.push("/admin/users");
    } else {
      router.push(`/admin/users?role=${newRole}`);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  // 2. Debounce từ khóa tìm kiếm (400ms)
  const debouncedSearch = useDebounce(searchTerm.trim(), 400);

  // 3. Phân trang thông minh:
  // - Nếu chọn "ALL" (Tất cả vai trò): Sử dụng API phân trang từ server LayDanhSachNguoiDung_PhanTrang
  // - Nếu chọn lọc theo vai trò (GV hoặc HV): Sử dụng LayDanhSachNguoiDung để lấy đủ danh sách,
  //   lọc chính xác theo vai trò và phân trang client-side để mỗi trang luôn có đủ 10 người,
  //   số trang và tổng số người chuẩn xác 100%, không bị tình trạng trang trống/hết dữ liệu mà vẫn ấn được.
  const isAllRoles = roleFilter === "ALL";

  // Query phân trang server (khi xem tất cả)
  const paginatedQuery = usePaginatedUsers(
    debouncedSearch,
    page,
    pageSize,
  );

  // Query toàn bộ danh sách (chỉ bật khi lọc theo vai trò GV / HV)
  const allUsersQuery = useAllUsers(debouncedSearch, !isAllRoles);

  // Dữ liệu khi lọc theo vai trò
  const filteredUsers = React.useMemo(() => {
    if (isAllRoles) return [];
    const all = allUsersQuery.data || [];
    return all.filter((u) => u.maLoaiNguoiDung === roleFilter);
  }, [allUsersQuery.data, isAllRoles, roleFilter]);

  // Tính toán dữ liệu hiển thị, tổng số lượng và tổng số trang
  const { users, totalCount, totalPages, currentPage, isLoading, isFetching, error } =
    React.useMemo(() => {
      if (isAllRoles) {
        const raw = paginatedQuery.data?.items || [];
        const count = paginatedQuery.data?.totalCount || 0;
        const pages = paginatedQuery.data?.totalPages || 0;
        const curr = paginatedQuery.data?.currentPage || page;
        return {
          users: raw,
          totalCount: count,
          totalPages: pages,
          currentPage: curr,
          isLoading: paginatedQuery.isLoading,
          isFetching: paginatedQuery.isFetching,
          error: paginatedQuery.error,
        };
      }

      // Khi lọc theo vai trò
      const count = filteredUsers.length;
      const pages = Math.ceil(count / pageSize);
      const safePage = Math.min(page, Math.max(1, pages));
      const start = (safePage - 1) * pageSize;
      const paginated = filteredUsers.slice(start, start + pageSize);

      return {
        users: paginated,
        totalCount: count,
        totalPages: pages,
        currentPage: safePage,
        isLoading: allUsersQuery.isLoading,
        isFetching: allUsersQuery.isFetching,
        error: allUsersQuery.error,
      };
    }, [
      isAllRoles,
      paginatedQuery.data,
      paginatedQuery.isLoading,
      paginatedQuery.isFetching,
      paginatedQuery.error,
      page,
      filteredUsers,
      pageSize,
      allUsersQuery.isLoading,
      allUsersQuery.isFetching,
      allUsersQuery.error,
    ]);

  const handleRefresh = () => {
    if (isAllRoles) {
      paginatedQuery.refetch();
    } else {
      allUsersQuery.refetch();
    }
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setPage(1);
    router.push("/admin/users");
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
        onSearchChange={handleSearchChange}
        onResetSearch={handleResetSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleChange}
        isLoading={isFetching}
        onRefresh={handleRefresh}
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
            onClick={handleRefresh}
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
        onEnrollCourses={setEnrollingUser}
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

      {/* Modal Dialog Ghi danh khóa học cho người dùng (13.2.1) */}
      <UserEnrollmentDialog
        user={enrollingUser}
        open={Boolean(enrollingUser)}
        onOpenChange={(open) => !open && setEnrollingUser(null)}
      />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-6 text-center text-sm text-muted-foreground">
          Đang tải danh sách người dùng...
        </div>
      }
    >
      <AdminUsersContent />
    </React.Suspense>
  );
}
