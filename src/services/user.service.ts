import axiosInstance from "@/lib/axios";
import type {
  User,
  LoginPayload,
  RegisterPayload,
  Profile,
  LoginResponse,
  RegisterResponse,
} from "@/schemas/user.schema";

export const userService = {
  login: (payload: LoginPayload) =>
    axiosInstance.post<LoginResponse>("/api/QuanLyNguoiDung/DangNhap", payload),

  register: (payload: RegisterPayload) =>
    axiosInstance.post<RegisterResponse>(
      "/api/QuanLyNguoiDung/DangKy",
      payload,
    ),

  getProfile: () =>
    axiosInstance.post<Profile>("/api/QuanLyNguoiDung/ThongTinTaiKhoan"),

  updateProfile: (payload: User) =>
    axiosInstance.put("/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung", payload),
};
