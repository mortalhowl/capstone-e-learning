import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { courseService } from "@/services/course.service";
import type { CourseRegisterPayload } from "@/schemas/course.schema";
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
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Hủy ghi danh thất bại!");
    },
  });
};
