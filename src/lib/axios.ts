import axios, { AxiosError, AxiosResponse } from "axios";
import { API_BASE_URL, CYBERSOFT_TOKEN, NODE_ENV } from "./constants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL || "https://elearningnew.cybersoft.edu.vn",
  timeout: 10000,
});

axiosInstance.interceptors.request.use((config) => {
  if (CYBERSOFT_TOKEN) {
    config.headers.TokenCybersoft = CYBERSOFT_TOKEN;
  }
  if (typeof window !== "undefined") {
    let token = localStorage.getItem("ACCESS_TOKEN");
    if (!token) {
      try {
        const rawAuth = localStorage.getItem("auth-storage");
        if (rawAuth) {
          const parsed = JSON.parse(rawAuth);
          token = parsed?.state?.user?.accessToken;
        }
        if (!token) {
          const rawUserLogin = localStorage.getItem("USER_LOGIN");
          if (rawUserLogin) {
            const parsed = JSON.parse(rawUserLogin);
            token = parsed?.accessToken;
          }
        }
      } catch {
        // ignore parse error
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (NODE_ENV === "development") {
      console.log("Development environment");
      // process error in here....
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
