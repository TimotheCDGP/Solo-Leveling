import { api } from "./api";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface UserBadge {
  id: string;
  badge: Badge;
  unlockedAt: string;
}

export const BadgeService = {
  getMyBadges: async (): Promise<UserBadge[]> => {
    const res = await api.get<UserBadge[]>("/badges/me");
    return res.data;
  },
};