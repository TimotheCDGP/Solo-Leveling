import { api } from "./api";
import type { User } from "@/types/auth";
import type { DashboardStats } from "@/types/dashboard";

export const UserService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/users/stats");
    return response.data;
  },

  getProfileStats: async () => {
    const response = await api.get("/users/me/profile");
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch("/users/me", data);
    return response.data;
  }
};