import { api } from "./api";
import type { DashboardStats } from "@/types/dashboard";

export const UserService = {
  // Récupère les stats globales pour les cartes du haut
  getDashboardStats: async (): Promise<DashboardStats> => {
    // PLUS TARD : return (await api.get('/users/stats')).data;
    
    // MOCK TEMPORAIRE (Pour que ton front tourne)
    await new Promise(r => setTimeout(r, 500));
    return {
      activeGoals: 4,
      completedGoals: 12,
      totalHabits: 3,
      totalXp: 1240,
      rank: "Aventurier (Rang C)"
    };
  }
};