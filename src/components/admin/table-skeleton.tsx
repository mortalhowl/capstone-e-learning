"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ─── 1. Page Header Skeleton ─────────────────────────────────────────
interface PageHeaderSkeletonProps {
  hasAction?: boolean;
}

export function PageHeaderSkeleton({ hasAction = true }: PageHeaderSkeletonProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-48 sm:w-64" />
        <Skeleton className="h-4 w-72 sm:w-96" />
      </div>
      {hasAction && (
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      )}
    </div>
  );
}

// ─── 2. Filter Bar Skeleton ──────────────────────────────────────────
export function FilterBarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card shadow-xs">
      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input skeleton */}
        <Skeleton className="h-9 w-full sm:w-72 rounded-md" />
        {/* Filter select skeleton */}
        <Skeleton className="h-9 w-full sm:w-44 rounded-md" />
      </div>
      {/* Right side stats/buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="size-9 rounded-md shrink-0" />
      </div>
    </div>
  );
}

// ─── 3. Pagination Skeleton ──────────────────────────────────────────
export function PaginationSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
      <Skeleton className="h-4 w-44" />
      <div className="flex items-center gap-1.5">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
      </div>
    </div>
  );
}

// ─── 4. Course Table Skeleton ────────────────────────────────────────
interface TableSkeletonProps {
  rowCount?: number;
}

export function CourseTableSkeleton({ rowCount = 6 }: TableSkeletonProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[320px]">Khóa học</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Người tạo</TableHead>
            <TableHead className="text-right">Học viên</TableHead>
            <TableHead className="text-right">Lượt xem</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="w-[70px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow key={`skeleton-course-${index}`}>
              {/* Cột 1: Khóa học */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-md shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </TableCell>

              {/* Cột 2: Danh mục */}
              <TableCell>
                <Skeleton className="h-5 w-24 rounded-full" />
              </TableCell>

              {/* Cột 3: Người tạo */}
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </TableCell>

              {/* Cột 4: Học viên */}
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>

              {/* Cột 5: Lượt xem */}
              <TableCell className="text-right">
                <Skeleton className="h-4 w-12 ml-auto" />
              </TableCell>

              {/* Cột 6: Ngày tạo */}
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>

              {/* Cột 7: Thao tác */}
              <TableCell className="text-right">
                <Skeleton className="size-8 rounded-md ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── 5. User Table Skeleton ──────────────────────────────────────────
export function UserTableSkeleton({ rowCount = 6 }: TableSkeletonProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="min-w-[240px]">Người dùng</TableHead>
            <TableHead className="min-w-[220px]">Email</TableHead>
            <TableHead className="min-w-[150px]">Số điện thoại</TableHead>
            <TableHead className="min-w-[150px]">Vai trò</TableHead>
            <TableHead className="w-[70px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <TableRow key={`skeleton-user-${index}`}>
              {/* Cột 1: Người dùng */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </TableCell>

              {/* Cột 2: Email */}
              <TableCell>
                <Skeleton className="h-4 w-40" />
              </TableCell>

              {/* Cột 3: Số điện thoại */}
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>

              {/* Cột 4: Vai trò */}
              <TableCell>
                <Skeleton className="h-5 w-24 rounded-full" />
              </TableCell>

              {/* Cột 5: Thao tác */}
              <TableCell className="text-right">
                <Skeleton className="size-8 rounded-md ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── 6. Enrollment Page Skeleton ─────────────────────────────────────
export function EnrollmentTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeaderSkeleton hasAction={false} />

      {/* Course Selector Skeleton */}
      <Card className="border shadow-xs">
        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-8 w-56" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={`stat-skeleton-${i}`} className="border bg-card shadow-xs">
            <CardContent className="p-4 flex items-center gap-3">
              <Skeleton className="size-10 rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs & Table Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-96 rounded-lg" />
        <div className="rounded-lg border bg-card overflow-hidden shadow-xs">
          <div className="p-4 border-b flex justify-between">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-8 w-60" />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Học viên</TableHead>
                <TableHead>Bí danh</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right w-[140px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`enroll-skeleton-${i}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full shrink-0" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 ml-auto rounded-md" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// ─── 7. Dashboard Overview Skeleton ──────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={`dash-stat-${i}`} className="border shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-5 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Tables Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`dash-course-${i}`} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <Skeleton className="size-10 rounded-md shrink-0" />
                  <div className="space-y-1 flex-1 min-w-0">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="border shadow-xs">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`dash-enroll-${i}`} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <Skeleton className="size-9 rounded-full shrink-0" />
                  <div className="space-y-1 flex-1 min-w-0">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
