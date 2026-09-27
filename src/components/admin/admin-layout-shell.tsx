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
    <div className="fixed inset-0 z-50 bg-background">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
