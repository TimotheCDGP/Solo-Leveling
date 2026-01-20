import { useEffect, useState } from "react";
import { GoalList } from "@/components/GoalList";
import { GoalService } from "@/services/api";

import type { Goal } from "@/types/goal";
import { ResponsiveGoalDialog } from "@/components/ResponsiveGoalDialog";

import { UserNav } from "@/components/UserNav"

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
    <div className="container mx-auto p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl pb-20"> 
      
      {/* HEADER MODIFIÉ : Flex row pour aligner Titre à gauche et UserNav à droite */}
      <div className="flex items-center justify-between">
        
        {/* Bloc Gauche : Titre */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Mes Objectifs</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Gérez vos ambitions.
          </p>
        </div>

        {/* Bloc Droite : Boutons d'action */}
        <div className="flex items-center gap-4">
          <ResponsiveGoalDialog onSuccess={fetchGoals} />
          
          <UserNav />
        </div>

      </div>

      <GoalList goals={goals} isLoading={isLoading} />
    </div>
  );
}