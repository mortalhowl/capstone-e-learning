import * as React from "react";
import { AuthGuard } from "@/components/shared/auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard requiredRole="GV">{children}</AuthGuard>;
}
