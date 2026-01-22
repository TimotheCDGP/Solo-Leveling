import { useEffect, useState } from "react";
import { UserService } from "@/services/user.service";
import { StatsCards } from "@/components/overview/StatsCards";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/types/dashboard";
import { ChartBarInteractive } from "@/components/overview/ChartBarInteractive";
import { ChartPieInteractive } from "@/components/overview/ChartPieInteractive";
import { ChartRadialProgression } from "@/components/overview/ChartRadialProgression";
import { ChartLineInteractive } from "@/components/overview/ChartLineInteractive";

export default function OverviewPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    UserService.getDashboardStats()
      .then(setStats)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-foreground animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 p-4 md:p-8 lg:px-12">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
          <p className="text-muted-foreground">Bienvenue, Hunter. Voici votre rapport d'activité.</p>
        </div>

        {isLoading || !stats ? (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
           </div>
        ) : (
          <StatsCards kpis={stats} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden bg-white">
             <ChartRadialProgression xp={stats?.xp ?? 0} rank={stats?.rank ?? "Rang E"} />
          </div>
          <div className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden bg-white">
             <ChartPieInteractive data={stats?.categoryData ?? []} />
          </div>
          
          <div className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden bg-white">
            <ChartBarInteractive data={stats?.priorityData ?? []} />
          </div>
          <div className="bg-card rounded-xl border border-border/80 shadow-sm overflow-hidden bg-white">
            <ChartLineInteractive data={stats?.weeklyActivity ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}