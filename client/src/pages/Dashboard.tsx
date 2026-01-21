import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSideBar";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionCards } from "@/components/SectionCards";
import { GoalList } from "@/components/GoalList";
import { ResponsiveGoalDialog } from "@/components/ResponsiveGoalDialog";
import { GoalService } from "@/services/goal.service";
import type { Goal } from "@/types/goal";

export default function Dashboard() {
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
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            
            <div className="mt-6">
                <SectionCards />
            </div>

            <div className="px-4 lg:px-6 flex flex-col gap-4">
                <div className="flex items-center justify-between mt-4">
                    <h2 className="text-xl font-bold tracking-tight">Mes Objectifs</h2>
                    <ResponsiveGoalDialog onSuccess={fetchGoals} />
                </div>
                
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
                     <GoalList 
                        goals={goals} 
                        isLoading={isLoading} 
                        onCreateClick={() => document.querySelector<HTMLButtonElement>('[data-trigger-create]')?.click()}
                     />
                </div>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}