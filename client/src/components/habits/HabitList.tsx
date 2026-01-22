import { useEffect, useState } from "react";
import { LayoutList } from "lucide-react";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitService } from "@/services/habit.service";
import type { Habit } from "@/types/habit";
import { Skeleton } from "@/components/ui/skeleton";

interface HabitListProps {
  refreshTrigger?: number; // Prop reçue du parent
}

export function HabitList({ refreshTrigger = 0 }: HabitListProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHabits = async () => {
    // Si ce n'est pas le premier chargement, on ne met pas isLoading à true 
    // pour éviter le clignotement des skeletons à chaque ajout.
    try {
      const data = await HabitService.findAll();
      setHabits(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // On recharge quand le composant monte OU quand refreshTrigger change
  useEffect(() => {
    fetchHabits();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[140px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl bg-muted/20 text-center animate-in fade-in-50 h-full">
            <div className="bg-background p-3 rounded-full mb-4">
                <LayoutList className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Aucune habitude</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
                Commence par créer un petit rituel quotidien en cliquant sur le bouton en haut.
            </p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {habits.map(habit => (
            <HabitCard 
                key={habit.id} 
                habit={habit} 
                onRefresh={fetchHabits} // Pour le refresh lors du toggle (check)
            />
        ))}
    </div>
  );
}