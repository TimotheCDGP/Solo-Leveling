import { useEffect, useState } from "react";
import { GoalList } from "@/components/goals/GoalList";
import { ResponsiveGoalDialog } from "@/components/goals/ResponsiveGoalDialog";
import { GoalService } from "@/services/goal.service";
import type { Goal } from "@/types/goal";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const data = await GoalService.getAll();
      setGoals(data);
    } catch (error) {
      console.error("Erreur chargement", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

        <div className="flex flex-col gap-4 px-1 lg:px-2 mt-2">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Mes Objectifs</h2>
                <ResponsiveGoalDialog onSuccess={fetchGoals} />
            </div>
            
            <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/30 border md:min-h-min p-4">
                  <GoalList 
                     goals={goals} 
                     isLoading={isLoading} 
                     onCreateClick={() => document.querySelector<HTMLButtonElement>('[data-trigger-create]')?.click()}
                  />
            </div>
        </div>
    </div>
  );
}