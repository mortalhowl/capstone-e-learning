import * as React from "react";
import { AuthGuard } from "@/components/shared/auth-guard";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="GV">
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </AuthGuard>
  );
}
