import { api } from "./api";
import type { Habit, CreateHabitPayload } from "@/types/habit";

export const HabitService = {
  findAll: async (): Promise<Habit[]> => {
    const res = await api.get<Habit[]>("/habits");
    return res.data;
  },

  create: async (data: CreateHabitPayload): Promise<Habit> => {
    const res = await api.post<Habit>("/habits", data);
    return res.data;
  },

  // Toggle pour une habitude SIMPLE
  toggleHabit: async (id: string): Promise<{ isCompletedToday: boolean }> => {
    const res = await api.patch(`/habits/${id}`);
    return res.data;
  },

  // Toggle pour une SOUS-ÉTAPE
  toggleStep: async (stepId: string): Promise<{ stepId: string, isCompleted: boolean, parentCompleted: boolean }> => {
    const res = await api.patch(`/habits/step/${stepId}`);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateHabitPayload>): Promise<Habit> => {
    const res = await api.patch<Habit>(`/habits/${id}/update`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/habits/${id}`);
  },

  addStep: async (habitId: string, title: string) => {
    const res = await api.post(`/habits/${habitId}/steps`, { title });
    return res.data;
  },

  deleteStep: async (stepId: string) => {
    await api.delete(`/habits/steps/${stepId}`);
  },

  updateStep: async (stepId: string, title: string) => {
    const res = await api.patch(`/habits/steps/${stepId}`, { title });
    return res.data;
    },
};