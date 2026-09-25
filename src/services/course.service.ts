import axiosInstance from "@/lib/axios";
import z from "zod";
import { MA_NHOM } from "@/lib/constants";
import {
  CourseSchema,
  type Course,
  type CourseCategory,
  type EnrollStudent,
  type Student,
  type CourseRegisterPayload,
  type CreateCoursePayload,
} from "@/schemas/course.schema";

import { createPaginatedResponse } from "@/schemas/api.schema";

export const PaginatedCourseSchema = createPaginatedResponse(CourseSchema);
export type PaginatedCourse = z.infer<typeof PaginatedCourseSchema>;

export const courseService = {
  getCourses: async (tenKhoaHoc = "") => {
    const response = await axiosInstance.get<Course[]>(
      "/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc",
      {
        params: {
          tenKhoaHoc: tenKhoaHoc || undefined,
          maNhom: MA_NHOM,
        },
      },
    );
    if (Array.isArray(response.data)) {
      response.data = response.data.filter(
        (c) => Boolean(c && typeof c.maKhoaHoc === "string" && c.maKhoaHoc.trim()),
      );
    }
    return response;
  },

  getCategories: (tenDanhMuc = "") =>
    axiosInstance.get<CourseCategory[]>(
      "/api/QuanLyKhoaHoc/LayDanhMucKhoaHoc",
      {
        params: {
          tenDanhMuc: tenDanhMuc || undefined,
        },
      },
    ),

  getByCategory: async (maDanhMuc = "") => {
    const response = await axiosInstance.get<Course[]>(
      "/api/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc",
      {
        params: {
          maDanhMuc: maDanhMuc || undefined,
          maNhom: MA_NHOM,
        },
      },
    );
    if (Array.isArray(response.data)) {
      response.data = response.data.filter(
        (c) => Boolean(c && typeof c.maKhoaHoc === "string" && c.maKhoaHoc.trim()),
      );
    }
    return response;
  },

  getPaginatedCourse: async (tenKhoaHoc = "", page = 1, pageSize = 10) => {
    const response = await axiosInstance.get<PaginatedCourse>(
      "/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang",
      {
        params: {
          tenKhoaHoc: tenKhoaHoc || undefined,
          page,
          pageSize,
          maNhom: MA_NHOM,
        },
      },
    );
    if (response.data && Array.isArray(response.data.items)) {
      response.data.items = response.data.items.filter(
        (c) => Boolean(c && typeof c.maKhoaHoc === "string" && c.maKhoaHoc.trim()),
      );
    }
    return response;
  },

  getCourse: (maKhoaHoc = "") =>
    axiosInstance.get<Course>("/api/QuanLyKhoaHoc/LayThongTinKhoaHoc", {
      params: {
        maKhoaHoc: maKhoaHoc || undefined,
      },
    }),

  getEnrollStudent: (maKhoaHoc: string) =>
    axiosInstance.get<EnrollStudent>(
      "/api/QuanLyKhoaHoc/LayThongTinHocVienKhoaHoc",
      {
        params: {
          maKhoaHoc,
        },
      },
    ),

  getStudentsByCourse: (maKhoaHoc: string) =>
    axiosInstance.post<Student[]>(
      "/api/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc",
      {
        MaKhoaHoc: maKhoaHoc,
        maKhoaHoc,
      },
    ),

  getPendingStudentsByCourse: (maKhoaHoc: string) =>
    axiosInstance.post<Student[]>(
      "/api/QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet",
      {
        MaKhoaHoc: maKhoaHoc,
        maKhoaHoc,
      },
    ),

  getUnenrolledUsersByCourse: (maKhoaHoc: string) =>
    axiosInstance.post<Student[]>(
      "/api/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh",
      {
        MaKhoaHoc: maKhoaHoc,
        maKhoaHoc,
      },
    ),

  enrollCourse: (payload: CourseRegisterPayload) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/GhiDanhKhoaHoc", {
      maKhoaHoc: payload.maKhoaHoc,
      taiKhoan: payload.taiKhoan,
      MaKhoaHoc: payload.maKhoaHoc,
      TaiKhoan: payload.taiKhoan,
    }),


  // note: course regiser == enroll about meaning, but enroll should using with admin enroll
  courseRegister: (payload: CourseRegisterPayload) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/DangKyKhoaHoc", payload),

  unenroll: (payload: CourseRegisterPayload) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/HuyGhiDanh", {
      maKhoaHoc: payload.maKhoaHoc,
      taiKhoan: payload.taiKhoan,
      MaKhoaHoc: payload.maKhoaHoc,
      TaiKhoan: payload.taiKhoan,
    }),


  createCourse: (payload: CreateCoursePayload) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/ThemKhoaHoc", payload),

  createCourseWithImage: (formData: FormData) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/ThemKhoaHocUploadHinh", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateCourse: (payload: CreateCoursePayload) =>
    axiosInstance.put("/api/QuanLyKhoaHoc/CapNhatKhoaHoc", payload),

  updateCourseWithImage: (formData: FormData) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/CapNhatKhoaHocUpload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteCourse: (maKhoaHoc: string) =>
    axiosInstance.delete("/api/QuanLyKhoaHoc/XoaKhoaHoc", {
      params: {
        MaKhoaHoc: maKhoaHoc,
      },
    }),

  uploadCourseImage: (formData: FormData) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/UploadHinhAnhKhoaHoc", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
