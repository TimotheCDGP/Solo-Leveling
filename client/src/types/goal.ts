export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type GoalStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';


export interface Step {
  id: string;
  title: string;
  isCompleted: boolean;
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

// Pour la création - sans L'ID, le status, et le userId
export interface CreateGoalDto {
  title: string;
  description?: string;
  category?: string;
  priority: Priority;
  startDate: string;
  deadline?: string;
}