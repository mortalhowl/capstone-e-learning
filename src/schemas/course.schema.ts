import z from "zod";
import { UserBasicSchema } from "./user.schema";

export const CourseCategorySchema = z.object({
  maDanhMuc: z.string(),
  tenDanhMuc: z.string(),
});
export type CourseCategory = z.infer<typeof CourseCategorySchema>;

export const CourseBasicSchema = z.object({
  maKhoaHoc: z.string(),
  tenKhoaHoc: z.string(),
  biDanh: z.string(),
  moTa: z.string(),
  luotXem: z.number(),
  hinhAnh: z.string(),
  ngayTao: z.string(),
  danhGia: z.number(),
});
export type CourseBasic = z.infer<typeof CourseBasicSchema>;

export const CourseSchema = CourseBasicSchema.omit({ danhGia: true }).extend({
  maNhom: z.string(),
  soLuongHocVien: z.number(),
  nguoiTao: UserBasicSchema.pick({
    taiKhoan: true,
    hoTen: true,
    maLoaiNguoiDung: true,
  }),
  tenLoaiNguoiDung: true,
  danhMucKhoaHoc: z.object({
    maDanhMucKhoahoc: z.string(),
    tenDanhMucKhoaHoc: z.string(),
  }),
});
export type Course = z.infer<typeof CourseSchema>;

export const StudentSchema = z.object({
  taiKhoan: z.string(),
  biDanh: z.string().nullable(),
  hoTen: z.string(),
});
export type Student = z.infer<typeof StudentSchema>;

export const EnrollStudentSchema = CourseSchema.extend({
  lstHocVien: z.array(StudentSchema).optional(),
});
export type EnrollStudent = z.infer<typeof EnrollStudentSchema>;

export const CourseRegisterSchema = z.object({
  maKhoaHoc: z.string(),
  taiKhoan: z.string(),
});
export type CourseRegisterPayload = z.infer<typeof CourseRegisterSchema>;
