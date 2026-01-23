"use client"

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabitList } from "@/components/habits/HabitList";
import { CreateHabitModal } from "@/components/habits/CreateHabitModal";
import { UserService } from "@/services/user.service";

export default function HabitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    UserService.getDashboardStats().then(() => console.log("Stats synchronisées"));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Habitudes</h2>
          <p className="text-muted-foreground font-inter">Construis ta discipline jour après jour.</p>
        </div>
        
        {/* BOUTON D'ACTION STYLE HUNTER */}
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="shrink-0 font-oswald uppercase italic font-bold tracking-wider"
        >
          <Plus className="h-4 w-4 mr-2" /> Nouvelle Habitude
        </Button>
      </div>

      {/* LISTE DES HABITUDES */}
      <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/30 border p-4">
        <HabitList refreshTrigger={refreshTrigger} />
      </div>

      {/* MODAL RESPONSIVE */}
      <CreateHabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
      />
    </div>
  );
}