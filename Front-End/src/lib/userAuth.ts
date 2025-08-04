import axios, { AxiosInstance } from "axios";
import { LoginCredentials, RegisterCredentials, User } from "@/types/Auth";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:4000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<{ user: User }>("/api/auth/login", credentials);
      return response.data.user;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.response?.data?.msg || error.message;
      throw new Error(msg || "Login failed");
    }
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const response = await api.post<{ user: User }>("/api/auth/register", credentials);
      return response.data.user;
    } catch (error: any) {
      const msg = error.response?.data?.msg || error.response?.data?.message || "Use another email or username";
      throw new Error(msg);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<{ user: User }>("/api/auth/status");
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.warn("Logout request failed, but continuing with local logout");
    }
  },

  async refreshToken(): Promise<User> {
    try {
      const response = await api.post<{ user: User }>("/api/auth/refresh");
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to refresh token");
    }
  },
};
