"use client";

import * as React from "react";
import { Search, X, Plus, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CourseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onResetSearch: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  totalCount?: number;
  onOpenCreateModal?: () => void;
}

export function CourseFilters({
  searchTerm,
  onSearchChange,
  onResetSearch,
  isLoading,
  onRefresh,
  totalCount,
  onOpenCreateModal,
}: CourseFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input Box */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Tìm kiếm theo tên khóa học..."
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

      {/* Action Buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        {typeof totalCount === "number" && (
          <span className="text-xs text-muted-foreground hidden md:inline-block mr-2">
            Tổng cộng: <strong className="text-foreground">{totalCount}</strong> khóa học
          </span>
        )}

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-9 gap-1.5 shrink-0"
            title="Tải lại danh sách"
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
          <span>Thêm khóa học</span>
        </Button>
      </div>
    </div>

  );
}
