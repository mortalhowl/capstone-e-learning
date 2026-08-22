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
          if (typeof window !== "undefined") {
            localStorage.setItem("ACCESS_TOKEN", user.accessToken);
            document.cookie = `ACCESS_TOKEN=${user.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          }
          set({ user, isAuthenticated: true });
        },

        logout: () => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("ACCESS_TOKEN");
            document.cookie = "ACCESS_TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
          }
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
