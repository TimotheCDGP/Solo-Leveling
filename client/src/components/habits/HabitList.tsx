"use client"

import { useEffect, useState, useCallback } from "react";
import { LayoutList } from "lucide-react";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitService } from "@/services/habit.service";
import type { Habit } from "@/types/habit";
import { Skeleton } from "@/components/ui/skeleton";

interface HabitListProps {
  refreshTrigger?: number;
}

export function HabitList({ refreshTrigger = 0 }: HabitListProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Utilisation de useCallback pour stabiliser la fonction
  const fetchHabits = useCallback(async () => {
    try {
      const data = await HabitService.findAll();
      setHabits(data);
    } catch (e) {
      console.error("Erreur lors de la récupération des habitudes:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * MISE À JOUR CIBLÉE (Optimistic / Real-time sync)
   * Cette fonction permet de mettre à jour une seule habitude dans la liste
   * sans provoquer un rechargement complet, garantissant que le Modal 
   * reçoit la nouvelle référence de l'objet immédiatement.
   */
  const handleUpdateHabit = useCallback((updatedHabit: Habit) => {
    setHabits(prevHabits => 
      prevHabits.map(h => h.id === updatedHabit.id ? updatedHabit : h)
    );
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [refreshTrigger, fetchHabits]);

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
        <h3 className="text-lg font-semibold font-oswald uppercase italic">Aucune habitude</h3>
        <p className="text-sm text-muted-foreground max-w-xs mb-4">
          Commence par créer un petit rituel quotidien pour commencer ton ascension.
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
          // On passe handleUpdateHabit pour une sync immédiate
          onRefresh={() => {
            fetchHabits(); // Garde le fetch pour la cohérence serveur
          }}
          // Si ton HabitCard supporte une prop de mise à jour directe :
          // onUpdate={handleUpdateHabit} 
        />
      ))}
    </div>
  );
}