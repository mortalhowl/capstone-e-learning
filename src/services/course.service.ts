import axiosInstance from "@/lib/axios";
import z from "zod";
import { MA_NHOM } from "@/lib/constants";
import {
  CourseSchema,
  type Course,
  type CourseCategory,
  type EnrollStudent,
  type CourseRegisterPayload,
  type CreateCoursePayload,
} from "@/schemas/course.schema";
import { createPaginatedResponse } from "@/schemas/api.schema";

export const PaginatedCourseSchema = createPaginatedResponse(CourseSchema);
export type PaginatedCourse = z.infer<typeof PaginatedCourseSchema>;

export const courseService = {
  getCourses: (tenKhoaHoc = "") =>
    axiosInstance.get<Course[]>("/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc", {
      params: {
        tenKhoaHoc: tenKhoaHoc || undefined,
        maNhom: MA_NHOM,
      },
    }),

  getCategories: (tenDanhMuc = "") =>
    axiosInstance.get<CourseCategory[]>(
      "/api/QuanLyKhoaHoc/LayDanhMucKhoaHoc",
      {
        params: {
          tenDanhMuc: tenDanhMuc || undefined,
        },
      },
    ),

  getByCategory: (maDanhMuc = "") =>
    axiosInstance.get<Course[]>("/api/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc", {
      params: {
        maDanhMuc: maDanhMuc || undefined,
        maNhom: MA_NHOM,
      },
    }),

  getPaginatedCourse: (tenKhoaHoc = "", page = 1, pageSize = 10) =>
    axiosInstance.get<PaginatedCourse>(
      "/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang",
      {
        params: {
          tenKhoaHoc: tenKhoaHoc || undefined,
          page,
          pageSize,
          maNhom: MA_NHOM,
        },
      },
    ),

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

  // note: course regiser == enroll about meaning, but enroll should using with admin enroll
  courseRegister: (payload: CourseRegisterPayload) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/DangKyKhoaHoc", payload),

  unenroll: (payload: CourseRegisterPayload) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/HuyGhiDanh", payload),

  createCourse: (payload: CreateCoursePayload) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/ThemKhoaHoc", payload),

  createCourseWithImage: (formData: FormData) =>
    axiosInstance.post("/api/QuanLyKhoaHoc/ThemKhoaHocUploadHinh", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
