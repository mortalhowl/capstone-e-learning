import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { LoginResponse } from "@/schemas/user.schema";
import { NODE_ENV } from "@/lib/constants";

interface AuthState {
  user: LoginResponse | null;
  isAuthenticated: boolean;

  setUser: (user: LoginResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,

        setUser: (user) => {
          localStorage.setItem("ACCESS_TOKEN", user.accessToken);
          set({ user, isAuthenticated: true });
        },

        logout: () => {
          localStorage.removeItem("ACCESS_TOKEN");
          set({ user: null, isAuthenticated: false });
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: "auth",
      enabled: NODE_ENV !== "production",
    },
  ),
);

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAdmin = () =>
  useAuthStore((state) => state.user?.maLoaiNguoiDung === "GV");
