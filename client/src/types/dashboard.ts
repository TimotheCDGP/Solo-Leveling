export interface DashboardStats {
  activeGoals: number;    // Compteur spécifique aux objectifs
  completedGoals: number; // Compteur spécifique aux objectifs
  totalHabits: number;    // Compteur spécifique aux habitudes (Optionnel)
  totalXp: number;        // GLOBAL (User)
  rank: string;           // GLOBAL (User)
}