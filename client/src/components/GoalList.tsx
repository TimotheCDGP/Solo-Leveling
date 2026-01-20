import { Ghost, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/GoalCard";
import type { Goal } from "@/types/goal";

interface GoalListProps {
  goals: Goal[];
  isLoading: boolean;
  onCreateClick?: () => void;
}

export function GoalList({ goals, isLoading, onCreateClick }: GoalListProps) {
  
  // 1. État de chargement (Skeleton)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }


  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed shadow-sm bg-muted/30 p-8 text-center animate-in fade-in-50">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
          <Ghost className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Aucun objectif</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
          Vous n'avez pas encore défini d'objectifs. Lancez-vous !
        </p>
        
        <Button variant="outline" onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Créer mon premier objectif
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 pb-20">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}