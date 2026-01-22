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
    UserService.getDashboardStats().then(() => console.log("XP Updated"));
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Habitudes</h2>
          <p className="text-muted-foreground">Construis ta discipline jour après jour.</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" /> Nouvelle Habitude
        </Button>
      </div>

      <div className="min-h-[50vh] flex-1 rounded-xl bg-muted/30 border p-4">
        <HabitList refreshTrigger={refreshTrigger} />
      </div>

      <CreateHabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess}
      />
    </div>
  );
}