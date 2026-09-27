import z from "zod";

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

export const CourseCreatorSchema = z.object({
  taiKhoan: z.string(),
  hoTen: z.string(),
  maLoaiNguoiDung: z.string(),
  tenLoaiNguoiDung: z.string().optional(),
});
export type CourseCreator = z.infer<typeof CourseCreatorSchema>;

export const CourseSchema = CourseBasicSchema.omit({ danhGia: true }).extend({
  maNhom: z.string(),
  soLuongHocVien: z.number(),
  nguoiTao: CourseCreatorSchema,
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

export const CreateCourseSchema = z.object({
  maKhoaHoc: z.string().min(1, "Mã khóa học không được để trống"),
  biDanh: z.string().min(1, "Bí danh không được để trống"),
  tenKhoaHoc: z.string().min(5, "Tên khóa học phải có tối thiểu 5 ký tự"),
  moTa: z.string().min(10, "Mô tả khóa học phải có tối thiểu 10 ký tự"),
  luotXem: z.number().default(0),
  danhGia: z.number().default(0),
  hinhAnh: z.string().optional().default(""),
  maNhom: z.string(),
  ngayTao: z.string(),
  maDanhMucKhoaHoc: z.string().min(1, "Vui lòng chọn danh mục khóa học"),
  taiKhoanNguoiTao: z.string().min(1, "Tài khoản người tạo không được để trống"),
});
export type CreateCoursePayload = z.infer<typeof CreateCourseSchema>;
