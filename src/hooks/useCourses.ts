import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { courseService } from "@/services/course.service";
import type {
  CourseRegisterPayload,
  CreateCoursePayload,
} from "@/schemas/course.schema";
import { userKeys } from "./useUsers";

export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: object) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

export const useCourses = (tenKhoaHoc = "") =>
  useQuery({
    queryKey: courseKeys.list({ tenKhoaHoc }),
    queryFn: () => courseService.getCourses(tenKhoaHoc).then((res) => res.data),
  });

export const usePaginatedCourse = (tenKhoaHoc = "", page = 1, pageSize = 10) =>
  useQuery({
    queryKey: courseKeys.list({ tenKhoaHoc, page, pageSize }),
    queryFn: () =>
      courseService
        .getPaginatedCourse(tenKhoaHoc, page, pageSize)
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

export const useCourse = (maKhoaHoc = "") =>
  useQuery({
    queryKey: courseKeys.detail(maKhoaHoc),
    queryFn: () => courseService.getCourse(maKhoaHoc).then((res) => res.data),
  });

export const useCourseCategories = (tenDanhMuc = "") =>
  useQuery({
    queryKey: ["course-categories"],
    queryFn: () =>
      courseService.getCategories(tenDanhMuc).then((res) => res.data),
  });

export const useCourseByCategory = (maDanhMuc: string) =>
  useQuery({
    queryKey: courseKeys.list({ maDanhMuc }),
    queryFn: () =>
      courseService.getByCategory(maDanhMuc).then((res) => res.data),
  });

export const useEnrollStudent = (maKhoaHoc: string, enabled = true) =>
  useQuery({
    queryKey: ["enroll-student", maKhoaHoc],
    queryFn: () =>
      courseService.getEnrollStudent(maKhoaHoc).then((res) => res.data),
    enabled: Boolean(maKhoaHoc) && enabled,
  });

export const useStudentsByCourse = (maKhoaHoc: string, enabled = true) =>
  useQuery({
    queryKey: ["course-students", maKhoaHoc],
    queryFn: () =>
      courseService.getStudentsByCourse(maKhoaHoc).then((res) => res.data),
    enabled: Boolean(maKhoaHoc) && enabled,
  });

export const usePendingStudentsByCourse = (maKhoaHoc: string, enabled = true) =>
  useQuery({
    queryKey: ["pending-students", maKhoaHoc],
    queryFn: () =>
      courseService
        .getPendingStudentsByCourse(maKhoaHoc)
        .then((res) => res.data),
    enabled: Boolean(maKhoaHoc) && enabled,
  });

export const useUnenrolledUsersByCourse = (maKhoaHoc: string, enabled = true) =>
  useQuery({
    queryKey: ["unenrolled-users", maKhoaHoc],
    queryFn: () =>
      courseService
        .getUnenrolledUsersByCourse(maKhoaHoc)
        .then((res) => res.data),
    enabled: Boolean(maKhoaHoc) && enabled,
  });

export const useEnrollUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CourseRegisterPayload) =>
      courseService.enrollCourse(payload),
    onSuccess: (_, payload) => {
      toast.success("Ghi danh học viên thành công!");
      queryClient.invalidateQueries({
        queryKey: ["course-students", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["pending-students", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["unenrolled-users", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(payload.maKhoaHoc),
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Ghi danh học viên thất bại!");
    },
  });
};

export const useApproveEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CourseRegisterPayload) =>
      courseService.enrollCourse(payload),
    onSuccess: (_, payload) => {
      toast.success("Duyệt ghi danh học viên thành công!");
      queryClient.invalidateQueries({
        queryKey: ["course-students", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["pending-students", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["unenrolled-users", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(payload.maKhoaHoc),
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Duyệt ghi danh thất bại!");
    },
  });
};

export const useRejectEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CourseRegisterPayload) =>
      courseService.unenroll(payload),
    onSuccess: (_, payload) => {
      toast.success("Đã từ chối ghi danh học viên!");
      queryClient.invalidateQueries({
        queryKey: ["course-students", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["pending-students", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["unenrolled-users", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(payload.maKhoaHoc),
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Từ chối ghi danh thất bại!");
    },
  });
};


export const useCourseRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CourseRegisterPayload) =>
      courseService.courseRegister(payload),
    onSuccess: (_, payload) => {
      toast.success("Đăng ký khóa học thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(payload.maKhoaHoc),
      });
      queryClient.invalidateQueries({
        queryKey: ["enroll-student", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-students", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["pending-students", payload.maKhoaHoc],
      });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Đăng ký khóa học thất bại!");
    },
  });
};

export const useUnenroll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CourseRegisterPayload) =>
      courseService.unenroll(payload),
    onSuccess: (_, payload) => {
      toast.success("Hủy ghi danh thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(payload.maKhoaHoc),
      });
      queryClient.invalidateQueries({
        queryKey: ["enroll-student", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["course-students", payload.maKhoaHoc],
      });
      queryClient.invalidateQueries({
        queryKey: ["pending-students", payload.maKhoaHoc],
      });
    },

    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Hủy ghi danh thất bại!");
    },
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCoursePayload) =>
      courseService.createCourse(payload),
    onSuccess: () => {
      toast.success("Tạo khóa học thành công!");
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Tạo khóa học thất bại!");
    },
  });
};

export const useCreateCourseWithImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      courseService.createCourseWithImage(formData),
    onSuccess: () => {
      toast.success("Tạo khóa học và tải ảnh lên thành công!");
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Tạo khóa học thất bại!");
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCoursePayload) =>
      courseService.updateCourse(payload),
    onSuccess: (_, payload) => {
      toast.success("Cập nhật khóa học thành công!");
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(payload.maKhoaHoc),
      });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Cập nhật khóa học thất bại!");
    },
  });
};

export const useUpdateCourseWithImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      courseService.updateCourseWithImage(formData),
    onSuccess: () => {
      toast.success("Cập nhật khóa học và tải ảnh lên thành công!");
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Cập nhật khóa học thất bại!");
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (maKhoaHoc: string) => courseService.deleteCourse(maKhoaHoc),
    onSuccess: () => {
      toast.success("Xóa khóa học thành công!");
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Xóa khóa học thất bại!");
    },
  });
};

export const useUploadCourseImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      courseService.uploadCourseImage(formData),
    onSuccess: () => {
      toast.success("Tải lên hình ảnh khóa học thành công!");
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Tải lên hình ảnh thất bại!");
    },
  });
};
