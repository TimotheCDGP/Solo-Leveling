import { useEffect, useState } from "react";
import { GoalList } from "@/components/GoalList";
import { GoalService } from "@/services/api";

import type { Goal } from "@/types/goal";
import { ResponsiveGoalDialog } from "@/components/ResponsiveGoalDialog";

export default function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction extraite pour pouvoir l'appeler au chargement ET après la création
  const fetchGoals = async () => {
    try {
      const data = await GoalService.getAll();
      setGoals(data);
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Objectifs</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos ambitions et suivez votre progression.
          </p>
        </div>

        <ResponsiveGoalDialog onSuccess={fetchGoals} />
        
      </div>

      <GoalList goals={goals} isLoading={isLoading} />
    </div>
  );
}