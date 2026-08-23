import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginPayload, RegisterPayload, User } from "@/schemas/user.schema";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: object) => [...userKeys.lists(), filters] as const,
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
