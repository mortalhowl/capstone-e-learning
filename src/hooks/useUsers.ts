import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";
import type {
  LoginPayload,
  RegisterPayload,
  User,
  CreateUserPayload,
  EditUserPayload,
} from "@/schemas/user.schema";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: object) => [...userKeys.lists(), filters] as const,
  allList: (tuKhoa: string) => [...userKeys.all, "allList", tuKhoa] as const,
  profile: () => [...userKeys.all, "profile"] as const,
};

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => userService.login(payload),
    onSuccess: (res) => setUser(res.data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => userService.register(payload),
  });
};

export const useProfile = (isAuthenticated: boolean) =>
  useQuery({
    queryKey: userKeys.profile(),
    queryFn: () => userService.getProfile().then((res) => res.data),
    enabled: isAuthenticated,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: User) => userService.updateProfile(payload),
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Cập nhật thông tin thất bại!");
    },
  });
};

export const usePaginatedUsers = (tuKhoa = "", page = 1, pageSize = 10) =>
  useQuery({
    queryKey: userKeys.list({ tuKhoa, page, pageSize }),
    queryFn: () =>
      userService
        .getPaginatedUsers(tuKhoa, page, pageSize)
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

export const useAllUsers = (tuKhoa = "", enabled = true) =>
  useQuery({
    queryKey: userKeys.allList(tuKhoa),
    queryFn: () => userService.getAllUsers(tuKhoa).then((res) => res.data),
    enabled,
    placeholderData: keepPreviousData,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userService.createUser(payload),
    onSuccess: () => {
      toast.success("Thêm người dùng mới thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Thêm người dùng thất bại!");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditUserPayload) => userService.updateUser(payload),
    onSuccess: () => {
      toast.success("Cập nhật thông tin người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Cập nhật người dùng thất bại!");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taiKhoan: string) => userService.deleteUser(taiKhoan),
    onSuccess: () => {
      toast.success("Xóa người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error: AxiosError<string>) => {
      toast.error(error.response?.data || "Xóa người dùng thất bại!");
    },
  });
};

export const useUnenrolledCoursesByUser = (
  taiKhoan: string,
  enabled = true,
) =>
  useQuery({
    queryKey: ["user-unenrolled-courses", taiKhoan],
    queryFn: () =>
      userService
        .getUnenrolledCoursesByUser(taiKhoan)
        .then((res) => res.data),
    enabled: enabled && Boolean(taiKhoan),
  });

export const useEnrolledCoursesByUser = (
  taiKhoan: string,
  enabled = true,
) =>
  useQuery({
    queryKey: ["user-enrolled-courses", taiKhoan],
    queryFn: () =>
      userService.getEnrolledCoursesByUser(taiKhoan).then((res) => {
        const raw = res.data || [];
        return raw.map((item: Record<string, unknown>) => ({
          maKhoaHoc: String(item.maKhoaHoc || item.MaKhoaHoc || ""),
          tenKhoaHoc: String(item.tenKhoaHoc || item.TenKhoaHoc || ""),
          biDanh: String(item.biDanh || item.BiDanh || ""),
        }));
      }),
    enabled: enabled && Boolean(taiKhoan),
  });

