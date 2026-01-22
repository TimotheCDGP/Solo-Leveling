import { api } from "./api";
import type { CreateGoalDto, Goal } from "@/types/goal";

export const GoalService = {
  getAll: async () => {
    const response = await api.get<Goal[]>('/goals');
    return response.data;
  },

  create: async (goal: CreateGoalDto) => {
    const payload = { 
      ...goal, 
      status: 'TODO', 
    };
    
    const response = await api.post<Goal>('/goals', payload);
    return response.data;
  },

  update: async (id: string, data: Partial<Goal>): Promise<Goal> => {
    const response = await api.patch<Goal>(`/goals/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Goal> => {
    return GoalService.update(id, { status } as any);
  },

  delete: async (id: string) => {
    await api.delete(`/goals/${id}`);
  }
};