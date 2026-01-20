import axios from 'axios';
import type { CreateGoalDto, Goal } from '../types/goal';

// J'attends kle back - en cours de dev - sur cette URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
});

export const GoalService = {
  getAll: async () => {
    const response = await api.get<Goal[]>('/goals');
    return response.data;
  },

  create: async (goal: CreateGoalDto) => {
    // Astuce JSON Server: Il génère l'ID tout seul
    // On hardcode userId tant que l'Auth n'est pas prête
    const payload = { ...goal, status: 'ACTIVE', userId: 'user-1' };
    const response = await api.post<Goal>('/goals', payload);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/goals/${id}`);
  }
};