import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/GoalCard";
import { GoalDetailModal } from "@/components/goals/GoalDetailModal"; 
import type { Goal } from "@/types/goal";

interface GoalListProps {
  goals: Goal[];
  isLoading: boolean;
  onCreateClick?: () => void;
  onRefresh?: () => void; 
}

export function GoalList({ goals: initialGoals, isLoading, onCreateClick, onRefresh }: GoalListProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setGoals(initialGoals);
  }, [initialGoals]);

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedGoal(null), 300);
  };

  const handleGoalUpdatedInModal = (updatedGoal: Goal) => {
    setSelectedGoal(updatedGoal);

    setGoals((prevGoals) => 
      prevGoals.map((g) => g.id === updatedGoal.id ? updatedGoal : g)
    );

    if (onRefresh) onRefresh();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[20rem] w-full rounded-[2rem] bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
     return (
        <div className="text-center py-10">
            <p>Aucun objectif.</p>
            <Button onClick={onCreateClick} variant="outline" className="mt-4">Créer</Button>
        </div>
     )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20 place-items-center md:place-items-stretch animate-in fade-in-50">
        {goals.map((goal) => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            onClick={() => handleGoalClick(goal)}
          />
        ))}
      </div>

      <GoalDetailModal 
        goal={selectedGoal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onGoalUpdated={handleGoalUpdatedInModal}
      />
    </>
  );
}