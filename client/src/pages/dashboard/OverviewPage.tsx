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
    <div className="flex flex-col gap-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col gap-4 px-1 lg:px-2 mt-2">
        <h2 className="text-2xl font-bold tracking-tight px-1">Tableau de Bord</h2>

        <div className="min-h-[70vh] flex-1 rounded-xl bg-muted/30 border p-4 md:p-6 space-y-8 text-foreground">
          {isLoading || !stats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
            </div>
          ) : (
            <StatsCards kpis={stats} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-background rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md">
               <ChartRadialProgression xp={stats?.xp ?? 0} rank={stats?.rank ?? "Rang E"} />
            </div>
            <div className="bg-background rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md">
               <ChartPieInteractive data={stats?.categoryData ?? []} />
            </div>
            
            <div className="bg-background rounded-xl border shadow-sm transition-all hover:shadow-md overflow-hidden">
              <ChartBarInteractive data={stats?.priorityData ?? []} />
            </div>
            <div className="bg-background rounded-xl border shadow-sm transition-all hover:shadow-md overflow-hidden">
              <ChartLineInteractive data={stats?.weeklyActivity ?? []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}