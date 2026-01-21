import axios from 'axios';
import type { Goal, CreateGoalDto } from '@/types/goal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const GoalService = {
  getAll: async () => {
    // Le backend utilise le token pour savoir qui est connecté et filtrer les données
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

  delete: async (id: string) => {
    await api.delete(`/goals/${id}`);
  }
};