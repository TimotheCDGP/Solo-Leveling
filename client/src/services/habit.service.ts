import { api } from "./api";
import type { Habit, CreateHabitPayload } from "@/types/habit";
import type { Badge } from "./badges.service";

// Type pour la réponse enrichie du backend lors d'une validation
export interface HabitActionResponse {
  isCompletedToday: boolean;
  habit: Habit;
  newBadges: Badge[];
}

export const HabitService = {
  findAll: async (): Promise<Habit[]> => {
    const res = await api.get<Habit[]>("/habits");
    return res.data;
  },

  create: async (data: CreateHabitPayload): Promise<Habit> => {
    const res = await api.post<Habit>("/habits", data);
    return res.data;
  },

  /**
   * Toggle pour une habitude principale
   * Renvoie l'habit complet + les éventuels badges débloqués
   */
  toggleHabit: async (id: string): Promise<HabitActionResponse> => {
    const res = await api.patch<HabitActionResponse>(`/habits/${id}`);
    return res.data;
  },

  /**
   * Toggle pour une SOUS-ÉTAPE
   * Si c'est la dernière étape, peut aussi renvoyer des badges
   */
  toggleStep: async (stepId: string): Promise<HabitActionResponse> => {
    const res = await api.patch<HabitActionResponse>(`/habits/step/${stepId}`);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateHabitPayload>): Promise<Habit> => {
    const res = await api.patch<Habit>(`/habits/${id}/update`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },

  addStep: async (habitId: string, title: string): Promise<any> => {
    const res = await api.post(`/habits/${habitId}/steps`, { title });
    return res.data;
  },

  deleteStep: async (stepId: string): Promise<void> => {
    await api.delete(`/habits/steps/${stepId}`);
  },

  updateStep: async (stepId: string, title: string): Promise<any> => {
    const res = await api.patch(`/habits/steps/${stepId}`, { title });
    return res.data;
  },
};