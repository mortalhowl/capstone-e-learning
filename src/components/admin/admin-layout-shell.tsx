"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    // fixed inset-0 → phủ toàn bộ viewport, che Header/Footer của root layout
    // z-50 → nằm trên tất cả element khác
    // Cách này không cần thay đổi root layout hay move file
    <div className="fixed inset-0 z-50 flex h-full w-full overflow-hidden bg-background">
      <SidebarProvider className="h-full w-full overflow-hidden">
        <React.Suspense fallback={<div className="w-64 bg-sidebar" />}>
          <AdminSidebar />
        </React.Suspense>
        <SidebarInset className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
