import axios from 'axios';
import type { Goal, CreateGoalDto } from '@/types/goal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
});

// Fonction utilitaire pour récupérer l'ID depuis le token stocké
const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    // On décode le token Base64 créé dans auth-mock.ts
    const decoded = JSON.parse(atob(token));
    return decoded.id;
  } catch (error) {
    console.error("Erreur de décodage token", error);
    return null;
  }
};

export const GoalService = {
  getAll: async () => {
    const userId = getCurrentUserId();
    if (!userId) return []; // Si pas connecté, liste vide
    
    // json-server permet de filtrer avec ?userId=...
    const response = await api.get<Goal[]>(`/goals?userId=${userId}`);
    return response.data;
  },

  create: async (goal: CreateGoalDto) => {
    const userId = getCurrentUserId();
    
    if (!userId) throw new Error("Utilisateur non connecté");

    const payload = { 
      ...goal, 
      status: 'ACTIVE', 
      userId: userId, // On utilise l'ID !
      completedAt: null 
    };
    
    const response = await api.post<Goal>('/goals', payload);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/goals/${id}`);
  }
};