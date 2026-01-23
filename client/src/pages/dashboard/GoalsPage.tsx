"use client"

import { useEffect, useState } from "react";
import { GoalList } from "@/components/goals/GoalList";
import { ResponsiveGoalDialog } from "@/components/goals/ResponsiveGoalDialog";
import { GoalService } from "@/services/goal.service";
import { Target } from "lucide-react";
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

  // Fonction pour déclencher l'ouverture du dialogue existant
  const openCreateDialog = () => {
    document.querySelector<HTMLButtonElement>('[data-trigger-create]')?.click();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 lg:px-2 mt-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mes Objectifs</h2>
          <p className="text-muted-foreground">Relève de nouveaux défis et gagne en puissance.</p>
        </div>
        <ResponsiveGoalDialog onSuccess={fetchGoals} />
      </div>
      
      <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/30 border md:min-h-min p-4">
        {!isLoading && goals.length === 0 ? (
          <div className="flex h-[45vh] flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-background p-4 rounded-2xl mb-4 shadow-sm border border-border/50">
              <Target className="h-10 w-10 text-muted-foreground opacity-40" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter font-oswald text-foreground">
              Aucun Objectif Actif
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-2 mb-6">
              Ton journal de quêtes est vide. Définis une mission pour commencer à accumuler de l'expérience.
            </p>
          </div>
        ) : (
          <GoalList 
            goals={goals} 
            isLoading={isLoading} 
            onCreateClick={openCreateDialog}
          />
        )}
      </div>
    </div>
  );
}