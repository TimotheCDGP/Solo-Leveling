export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type GoalStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';


export interface Step {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  order: number;
  goalId: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority: Priority;
  status: GoalStatus;
  startDate: string;
  deadline?: string;
  userId: string;
  steps?: Step[];
}

export interface CreateGoalDto {
  title: string;
  description?: string;
  category?: string;
  priority: Priority;
  startDate: string;
  deadline?: string;
  steps?: { title: string; description?: string }[];
}