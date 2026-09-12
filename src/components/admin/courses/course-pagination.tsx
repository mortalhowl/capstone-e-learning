"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoursePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function CoursePagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  disabled = false,
}: CoursePaginationProps) {
  if (totalPages <= 1) return null;

  // Tính khoảng bản ghi đang hiển thị: Từ startRecord đến endRecord
  const startRecord = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  // Thuật toán sinh danh sách trang có dấu '...' (ellipsis)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2">
      {/* Thông tin số lượng hiển thị */}
      <div className="text-xs text-muted-foreground">
        Hiển thị <span className="font-semibold text-foreground">{startRecord}</span> -{" "}
        <span className="font-semibold text-foreground">{endRecord}</span> trong tổng số{" "}
        <span className="font-semibold text-foreground">{totalCount}</span> khóa học
      </div>

      {/* Điều hướng trang */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        {/* Nút Trước (Previous) */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || disabled}
          className="h-8 px-2.5 text-xs gap-1"
        >
          <ChevronLeft className="size-3.5" />
          <span>Trước</span>
        </Button>

        {/* Chế độ hiển thị trên Mobile: Trang X / Y */}
        <div className="flex sm:hidden items-center text-xs font-medium text-muted-foreground px-2">
          <span>
            Trang <strong className="text-foreground">{currentPage}</strong> / {totalPages}
          </span>
        </div>

        {/* Các nút số trang trên Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((pageNum, idx) => {
            if (pageNum === "ellipsis") {
              return (
                <div
                  key={`ellipsis-${idx}`}
                  className="flex size-8 items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="size-3.5" />
                </div>
              );
            }

            const isActive = pageNum === currentPage;
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                disabled={disabled}
                className={`size-8 p-0 text-xs font-medium ${
                  isActive ? "pointer-events-none font-bold" : ""
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Nút Sau (Next) */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || disabled}
          className="h-8 px-2.5 text-xs gap-1"
        >
          <span>Sau</span>
          <ChevronRight className="size-3.5" />
        </Button>
      </div>

    </div>
  );
}
