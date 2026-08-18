import z from "zod";
import { CourseBasicSchema } from "./course.schema";

export const UserBasicSchema = z.object({
  taiKhoan: z.string(),
  matKhau: z.string(),
  hoTen: z.string(),
  soDT: z.string(),
  maLoaiNguoiDung: z.string(),
  maNhom: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof UserBasicSchema>;

export const ProfileSchema = UserBasicSchema.extend({
  chiTietKhoaHocGhiDanh: z.array(CourseBasicSchema).optional(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const LoginResponseSchema = UserBasicSchema.omit({
  matKhau: true,
}).extend({
  accessToken: z.string(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const LoginSchema = z.object({
  taiKhoan: z
    .string()
    .min(5, "Tài khoản phải có tối thiểu 5 ký tự")
    .max(30, "Tài khoản không được vượt quá 30 ký tự"),
  matKhau: z
    .string()
    .min(5, "Mật khẩu phải có tối thiểu 5 ký tự")
    .max(30, "Mật khẩu không được vượt quá 30 ký tự"),
});
export type LoginPayload = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  taiKhoan: z
    .string()
    .min(5, "Tài khoản phải có tối thiểu 5 ký tự")
    .max(30, "Tài khoản không được vượt quá 30 ký tự"),
  matKhau: z
    .string()
    .min(5, "Mật khẩu phải có tối thiểu 5 ký tự")
    .max(30, "Mật khẩu không được vượt quá 30 ký tự"),
  hoTen: z
    .string()
    .min(5, "Họ tên phải có tối thiểu 5 ký tự")
    .max(30, "Họ tên không được vượt quá 30 ký tự"),
  soDT: z
    .string()
    .regex(
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
      "Số điện thoại không hợp lệ (phải gồm 10 chữ số)",
    ),
  maNhom: z
    .string()
    .min(1, "Mã nhóm không được để trống")
    .max(4, "Mã nhóm không được vượt quá 4 ký tự"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không đúng định dạng"),
});
export const RegiterSchema = RegisterSchema;
export type RegisterPayload = z.infer<typeof RegisterSchema>;

export const RegisterFormSchema = RegisterSchema.extend({
  xacNhanMatKhau: z.string(),
}).refine((data) => data.matKhau === data.xacNhanMatKhau, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["xacNhanMatKhau"],
});
export type RegisterForm = z.infer<typeof RegisterFormSchema>;

export const RegisterResponseSchema = UserBasicSchema.omit({
  maLoaiNguoiDung: true,
});
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
