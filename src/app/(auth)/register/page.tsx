import type { Metadata } from "next";
import { RegisterForm } from "@/components/users/register-form";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản học trực tuyến tại Cyber E-Learning",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
