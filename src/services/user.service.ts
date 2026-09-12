import axiosInstance from "@/lib/axios";
import { MA_NHOM } from "@/lib/constants";
import type {
  User,
  LoginPayload,
  RegisterPayload,
  Profile,
  LoginResponse,
  RegisterResponse,
  PaginatedUser,
  CreateUserPayload,
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

  getPaginatedUsers: (tuKhoa = "", page = 1, pageSize = 10) =>
    axiosInstance.get<PaginatedUser>(
      "/api/QuanLyNguoiDung/LayDanhSachNguoiDung_PhanTrang",
      {
        params: {
          MaNhom: MA_NHOM,
          tuKhoa: tuKhoa || undefined,
          page,
          pageSize,
        },
      },
    ),

  createUser: (payload: CreateUserPayload) =>
    axiosInstance.post("/api/QuanLyNguoiDung/ThemNguoiDung", payload),
};
