export interface HabitStep {
  id: string;
  title: string;
  isCompleted: boolean;
  order: number;
  habitId: string;
}

export interface HabitLog {
  id: string;
  date: string;
  isCompleted: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: string;
  frequency: string; // 'DAILY' ou 'WEEKLY'
  isCompletedToday: boolean;
  currentStreak: number;
  xpReward: number;
  
  steps: HabitStep[];
  userId: string;

  habitLogs: HabitLog[];

  createdAt: string;
  updatedAt: string;
  lastCompletedAt?: string | null;
}

export interface CreateHabitPayload {
  title: string;
  name: string;
  category: string;
  frequency?: string;
  description?: string;
  steps?: { title: string }[];
}