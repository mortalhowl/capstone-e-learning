"use client";

import * as React from "react";
import { Search, RotateCcw, Filter, Check } from "lucide-react";

import { useCourseCategories } from "@/hooks/useCourses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CourseFilterSidebarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}

export function CourseFilterSidebar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  onReset,
  className,
}: CourseFilterSidebarProps) {
  const { data: categories, isLoading } = useCourseCategories();

  const isFiltered = Boolean(search || (category && category !== "all"));

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div className="flex items-center gap-2 font-bold text-base text-foreground">
          <Filter className="size-4 text-primary" />
          <span>Bộ lọc</span>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="size-3" />
            <span>Xóa tất cả</span>
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Tìm kiếm
        </label>
        <div className="relative flex items-center">
          <Search className="size-4 text-muted-foreground absolute left-3 pointer-events-none" />
          <Input
            type="text"
            placeholder="Tìm khóa học..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 text-sm bg-background border-border/80"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Danh mục
        </label>

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left cursor-pointer",
              !category || category === "all"
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span>Tất cả danh mục</span>
            {(!category || category === "all") && <Check className="size-4 text-primary" />}
          </button>

          {isLoading ? (
            <div className="space-y-2 pt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
              ))}
            </div>
          ) : (
            categories?.map((cat) => {
              const isSelected = category === cat.maDanhMuc;
              return (
                <button
                  key={cat.maDanhMuc}
                  type="button"
                  onClick={() => onCategoryChange(cat.maDanhMuc)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left cursor-pointer",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="truncate">{cat.tenDanhMuc}</span>
                  {isSelected && <Check className="size-4 text-primary shrink-0 ml-2" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
