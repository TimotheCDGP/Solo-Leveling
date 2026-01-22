import { api } from "./api";
import type { Step } from "@/types/goal";

export const StepsService = {
  // POST /steps/:goalId
  create: async (goalId: string, data: { title: string; description?: string }): Promise<Step> => {
    const response = await api.post<Step>(`/steps/${goalId}`, data);
    return response.data;
  },

  // PATCH /steps/:id/toggle
  toggle: async (stepId: string): Promise<Step> => {
    const response = await api.patch<Step>(`/steps/${stepId}/toggle`);
    return response.data;
  },

  update: async (stepId: string, data: { title?: string; description?: string }): Promise<Step> => {
    const response = await api.patch<Step>(`/steps/${stepId}`, data);
    return response.data;
  },

  // DELETE /steps/:id
  delete: async (stepId: string): Promise<void> => {
    await api.delete(`/steps/${stepId}`);
  }
};