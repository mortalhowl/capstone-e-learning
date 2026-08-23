import * as React from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/users/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description:
    "Đăng nhập vào hệ thống Cyber E-Learning để tiếp tục học tập và phát triển kỹ năng",
};

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginForm />
    </React.Suspense>
  );
}
