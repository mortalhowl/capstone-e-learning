import z from "zod";

export const CourseCategorySchema = z.object({
  maDanhMuc: z.string(),
  tenDanhMuc: z.string(),
});

export type CourseCategory = z.infer<typeof CourseCategorySchema>;

export const NguoiTaoSchema = z.object({
  taiKhoan: z.string(),
  hoTen: z.string(),
  maLoaiNguoiDung: z.string(),
  tenLoaiNguoiDung: z.string(),
});

export const DanhMucKhoaHocSchema = z.object({
  maDanhMucKhoahoc: z.string(),
  tenDanhMucKhoaHoc: z.string(),
});

export const CourseSchema = z.object({
  maKhoaHoc: z.string(),
  biDanh: z.string(),
  tenKhoaHoc: z.string(),
  moTa: z.string(),
  luotXem: z.number(),
  hinhAnh: z.string(),
  maNhom: z.string(),
  ngayTao: z.string(),
  soLuongHocVien: z.number(),
  nguoiTao: NguoiTaoSchema,
  danhMucKhoaHoc: DanhMucKhoaHocSchema,
});

export type Course = z.infer<typeof CourseSchema>;

export const CourseRegisterSchema = z.object({
  maKhoaHoc: z.string(),
  taiKhoan: z.string(),
});

export type CourseRegisterPayload = z.infer<typeof CourseRegisterSchema>;

export const EnrollSchema = z.object({
  maKhoaHoc: z.string(),
  taiKhoan: z.string(),
});

export type EnrollPayload = z.infer<typeof EnrollSchema>;
