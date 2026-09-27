"use client";

import * as React from "react";
import { Search, X, Plus, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const COURSE_CATEGORIES = [
  { maDanhMuc: "BackEnd", tenDanhMuc: "Lập trình Backend" },
  { maDanhMuc: "Design", tenDanhMuc: "Thiết kế Web" },
  { maDanhMuc: "DiDong", tenDanhMuc: "Lập trình di động" },
  { maDanhMuc: "FrontEnd", tenDanhMuc: "Lập trình Front end" },
  { maDanhMuc: "FullStack", tenDanhMuc: "Lập trình Full Stack" },
  { maDanhMuc: "TuDuy", tenDanhMuc: "Tư duy lập trình" },
] as const;

interface CourseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onResetSearch: () => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  creatorFilter?: string;
  onCreatorFilterChange?: (creator: string) => void;
  currentUsername?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  totalCount?: number;
  onOpenCreateModal?: () => void;
}

export function CourseFilters({
  searchTerm,
  onSearchChange,
  onResetSearch,
  categoryFilter,
  onCategoryFilterChange,
  creatorFilter = "ALL",
  onCreatorFilterChange,
  currentUsername,
  isLoading,
  onRefresh,
  totalCount,
  onOpenCreateModal,
}: CourseFiltersProps) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      {/* Khung tìm kiếm & Bộ lọc danh mục, người tạo */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-3xl">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Tìm kiếm theo mã hoặc tên khóa học..."
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

        {/* Lọc theo 6 Chương mục / Danh mục (Yêu cầu 2) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
            title="Lọc theo chương mục / danh mục khóa học"
          >
            <option value="ALL">Tất cả danh mục (6 danh mục)</option>
            {COURSE_CATEGORIES.map((cat) => (
              <option key={cat.maDanhMuc} value={cat.maDanhMuc}>
                {cat.tenDanhMuc}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Người tạo (Yêu cầu 1) */}
        {onCreatorFilterChange && (
          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={creatorFilter}
              onChange={(e) => onCreatorFilterChange(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
              title="Lọc ưu tiên khóa học theo người tạo"
            >
              <option value="ALL">
                Tất cả (Ưu tiên khóa học của bạn)
              </option>
              <option value="MINE">
                {currentUsername
                  ? `Chỉ khóa học của tôi (@${currentUsername})`
                  : "Chỉ khóa học của tôi"}
              </option>
            </select>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full xl:w-auto">
        {typeof totalCount === "number" && (
          <span className="text-xs text-muted-foreground hidden lg:inline-block mr-2">
            Tổng số: <strong className="text-foreground">{totalCount}</strong> khóa học
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
