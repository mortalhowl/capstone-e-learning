"use client";

import * as React from "react";
import { Search, X, Plus, RefreshCw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onResetSearch: () => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  totalCount?: number;
  onOpenCreateModal?: () => void;
}

export function UserFilters({
  searchTerm,
  onSearchChange,
  onResetSearch,
  roleFilter,
  onRoleFilterChange,
  isLoading,
  onRefresh,
  totalCount,
  onOpenCreateModal,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Khung tìm kiếm & Lọc vai trò */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Tìm theo tài khoản, họ tên hoặc email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 h-9"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={onResetSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title="Xóa tìm kiếm"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Lọc loại người dùng (GV / HV) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="GV">Giáo vụ / Giảng viên (GV)</option>
            <option value="HV">Học viên (HV)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto">
        {typeof totalCount === "number" && (
          <span className="text-xs text-muted-foreground hidden md:inline-block mr-2">
            Tổng số: <strong className="text-foreground">{totalCount}</strong> tài khoản
          </span>
        )}

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-9 gap-1.5 shrink-0"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
        )}

        <Button
          size="sm"
          onClick={onOpenCreateModal}
          className="h-9 gap-1.5 bg-primary text-primary-foreground cursor-pointer flex-1 sm:flex-initial"
        >
          <Plus className="size-4" />
          <span>Thêm người dùng</span>
        </Button>
      </div>
    </div>

  );
}
