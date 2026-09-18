"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { useSearchParams, useRouter } from "next/navigation";
import { usePaginatedUsers, useAllUsers } from "@/hooks/useUsers";
import { useDebounce } from "@/hooks/use-debounce";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UserTable } from "@/components/admin/users/user-table";
import { UserPagination } from "@/components/admin/users/user-pagination";
import { Button } from "@/components/ui/button";
import type { UserItem } from "@/schemas/user.schema";

function AdminUsersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleParam = searchParams.get("role") || "ALL";

  // 1. Quản lý State: tìm kiếm, bộ lọc vai trò và phân trang
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [roleFilter, setRoleFilter] = React.useState<string>(roleParam);
  const [page, setPage] = React.useState<number>(1);
  const pageSize = 10;

  // Đồng bộ roleFilter khi URL searchParam thay đổi (ví dụ khi user click từ sidebar)
  React.useEffect(() => {
    setRoleFilter(roleParam);
  }, [roleParam]);

  const handleRoleChange = (newRole: string) => {
    setRoleFilter(newRole);
    if (newRole === "ALL") {
      router.push("/admin/users");
    } else {
      router.push(`/admin/users?role=${newRole}`);
    }
  };

  // 2. Debounce từ khóa tìm kiếm (400ms)
  const debouncedSearch = useDebounce(searchTerm.trim(), 400);

  // 3. Reset về trang 1 khi từ khóa hoặc bộ lọc vai trò thay đổi
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  // 4. Phân trang thông minh:
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

  // Tự động điều chỉnh trang nếu vượt quá totalPages
  React.useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const handleRefresh = () => {
    if (isAllRoles) {
      paginatedQuery.refetch();
    } else {
      allUsersQuery.refetch();
    }
  };

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
        onRoleFilterChange={handleRoleChange}
        isLoading={isFetching}
        onRefresh={handleRefresh}
        totalCount={totalCount}
        onOpenCreateModal={() => {
          // Chuẩn bị cho feature tạo người dùng tiếp theo
        }}
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
