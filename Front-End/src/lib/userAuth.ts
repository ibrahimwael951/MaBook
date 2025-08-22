import axios, { AxiosInstance, AxiosError } from "axios";
import {
  LoginCredentials,
  Post,
  RegisterCredentials,
  User,
  UserProfile,
  Update,
} from "@/types/Auth";

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
      const response = await api.post<{ user: User }>(
        "/api/auth/login",
        credentials
      );
      return response.data.user;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message;
        throw new Error(msg || "Login failed");
      }
      throw new Error("Login failed due to unexpected error");
    }
  },

  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      const response = await api.post<{ user: User }>(
        "/api/auth/register",
        credentials
      );
      return response.data.user;
    } catch (error) {
      if (error instanceof AxiosError) {
        const msg =
          error.response?.data?.msg ||
          error.response?.data?.message ||
          "Use another email or username";
        throw new Error(msg);
      }
      throw new Error("Registration failed due to unexpected error");
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<{ user: User }>("/api/auth/status");
      return response.data.user;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch user"
        );
      }
      throw new Error("Failed to fetch user due to unexpected error");
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } catch {
      console.warn("Logout request failed, but continuing with local logout");
    }
  },

  async refreshToken(): Promise<User> {
    try {
      const response = await api.post<{ user: User }>("/api/auth/refresh");
      return response.data.user;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to refresh token"
        );
      }
      throw new Error("Failed to refresh token due to unexpected error");
    }
  },

  async checkUsername(username: string): Promise<true> {
    try {
      await api.post("/api/check/username", { username });
      return true;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const msg =
          error.response?.data?.msg ||
          error.response?.data?.message ||
          "Username check failed";
        throw new Error(msg);
      }
      throw new Error("Unexpected error during username check");
    }
  },

  async CheckEmail(email: string): Promise<true> {
    try {
      await api.post("/api/check/email", { email });
      return true;
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg =
          err.response?.data?.msg ||
          err.response?.data?.message ||
          "Email check failed";
        throw new Error(msg);
      }
      throw new Error("Unexpected error during Email check");
    }
  },

  async GetUser(Username: string): Promise<UserProfile> {
    try {
      const res = await api.get<UserProfile>(`/api/user/search/${Username}`);
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg =
          err.response?.data?.msg ||
          err.response?.data?.message ||
          "User fetch failed";
        throw new Error(msg);
      }
      throw new Error("Unexpected error during user fetch");
    }
  },
  async GetUserPosts(Username: string): Promise<Post[]> {
    try {
      const res = await api.get<Post[]>(`/api/user/${Username}/posts`);
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg =
          err.response?.data?.msg ||
          err.response?.data?.message ||
          "User Posts fetch failed";
        throw new Error(msg);
      }
      throw new Error("Unexpected error during user posts fetch");
    }
  },
  async UpdateUser(user: Update): Promise<User> {
    try {
      const res = await api.patch(`/api/auth/update`, { ...user });
      return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg =
          err.response?.data?.msg ||
          err.response?.data?.message ||
          "Update user failed";
        throw new Error(msg);
      }
      throw new Error("Unexpected error during Update user");
    }
  },
};
