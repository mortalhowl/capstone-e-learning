"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Filter, ArrowUpDown } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CourseFilterSidebar } from "./course-filter-sidebar";
import { cn } from "@/lib/utils";

export type SortOption = "newest" | "views" | "students" | "name";

interface CourseListHeaderProps {
  totalCount: number;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
}

export function CourseListHeader({
  totalCount,
  sortBy,
  onSortChange,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  onReset,
}: CourseListHeaderProps) {
  const [filterOpen, setFilterOpen] = React.useState(false);

  const sortLabels: Record<SortOption, string> = {
    newest: "Mới nhất",
    views: "Xem nhiều nhất",
    students: "Học viên nhiều nhất",
    name: "Tên A → Z",
  };

  return (
    <div className="space-y-4">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="size-3.5 opacity-60" />
        <span className="font-semibold text-foreground">Khóa học</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Danh sách khóa học
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Hiển thị <span className="font-semibold text-foreground">{totalCount}</span> kết quả
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "lg:hidden h-9 px-3 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              )}
            >
              <Filter className="size-3.5 text-primary" />
              <span>Bộ lọc</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[360px] p-6 overflow-y-auto">
              <SheetHeader className="p-0 pb-4 text-left">
                <SheetTitle className="text-base font-bold">Bộ lọc tìm kiếm</SheetTitle>
              </SheetHeader>
              <CourseFilterSidebar
                search={search}
                onSearchChange={onSearchChange}
                category={category}
                onCategoryChange={(val) => {
                  onCategoryChange(val);
                  setFilterOpen(false);
                }}
                onReset={() => {
                  onReset();
                  setFilterOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 px-3 text-xs font-medium flex items-center gap-2 cursor-pointer"
              )}
            >
              <ArrowUpDown className="size-3.5 text-muted-foreground" />
              <span>Sắp xếp: <strong className="font-semibold text-foreground">{sortLabels[sortBy]}</strong></span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 p-1">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => onSortChange("newest")}
                  className={cn("text-xs cursor-pointer", sortBy === "newest" && "font-bold text-primary")}
                >
                  Mới nhất
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSortChange("views")}
                  className={cn("text-xs cursor-pointer", sortBy === "views" && "font-bold text-primary")}
                >
                  Xem nhiều nhất
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSortChange("students")}
                  className={cn("text-xs cursor-pointer", sortBy === "students" && "font-bold text-primary")}
                >
                  Học viên nhiều nhất
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSortChange("name")}
                  className={cn("text-xs cursor-pointer", sortBy === "name" && "font-bold text-primary")}
                >
                  Tên A → Z
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
