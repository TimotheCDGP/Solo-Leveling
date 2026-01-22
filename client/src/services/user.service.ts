import { api } from "./api";
import type { DashboardStats } from "@/types/dashboard";

export const UserService = {
  // Récupère les stats globales pour les cartes du haut
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/users/stats');
    return response.data;
  }
};