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
  EditUserPayload,
  UserItem,
} from "@/schemas/user.schema";
import type {
  UnenrolledCourse,
  UserEnrolledCourse,
  UserPendingCourse,
} from "@/schemas/course.schema";

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

  getAllUsers: (tuKhoa = "") =>
    axiosInstance.get<UserItem[]>("/api/QuanLyNguoiDung/LayDanhSachNguoiDung", {
      params: {
        MaNhom: MA_NHOM,
        tuKhoa: tuKhoa || undefined,
      },
    }),

  createUser: (payload: CreateUserPayload) =>
    axiosInstance.post("/api/QuanLyNguoiDung/ThemNguoiDung", payload),

  updateUser: (payload: EditUserPayload) =>
    axiosInstance.put("/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung", payload),

  deleteUser: (taiKhoan: string) =>
    axiosInstance.delete("/api/QuanLyNguoiDung/XoaNguoiDung", {
      params: { TaiKhoan: taiKhoan },
    }),

  getUnenrolledCoursesByUser: (taiKhoan: string) =>
    axiosInstance.post<UnenrolledCourse[]>(
      "/api/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh",
      {
        TaiKhoan: taiKhoan,
        taiKhoan,
      },
      {
        params: {
          TaiKhoan: taiKhoan,
        },
      },
    ),

  getEnrolledCoursesByUser: (taiKhoan: string) =>
    axiosInstance.post<UserEnrolledCourse[]>(
      "/api/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet",
      {
        TaiKhoan: taiKhoan,
        taiKhoan,
      },
      {
        params: {
          TaiKhoan: taiKhoan,
        },
      },
    ),

  getPendingCoursesByUser: (taiKhoan: string) =>
    axiosInstance.post<UserPendingCourse[]>(
      "/api/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet",
      {
        TaiKhoan: taiKhoan,
        taiKhoan,
      },
      {
        params: {
          TaiKhoan: taiKhoan,
        },
      },
    ),
};


