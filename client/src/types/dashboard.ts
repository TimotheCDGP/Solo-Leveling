export interface DashboardStats {
  activeGoals: number;
  completedGoals: number;
  totalHabits: number;
  xp: number;
  rank: string;
  rankColor: string;
  bestStreak: number;
  categoryData: { name: string; value: number }[];
  priorityData: { name: string; value: number }[];
  weeklyActivity: { date: string; desktop: number; mobile: number }[];
}