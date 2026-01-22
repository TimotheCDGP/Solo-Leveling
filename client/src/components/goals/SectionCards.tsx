import { Target, Zap, Trophy, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/types/dashboard";

interface SectionCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export function SectionCards({ stats, isLoading }: SectionCardsProps) {
  const renderValue = (value: string | number | undefined) => {
    if (isLoading || stats === null) return <Skeleton className="h-8 w-16" />;
    return <div className="text-2xl font-bold">{value}</div>;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Objectifs en cours</CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {renderValue(stats?.activeGoals)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Habitudes Actives</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          {renderValue(stats?.totalHabits)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Niveau Aventurier</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2">
             {renderValue(`${stats?.xp || 0} XP`)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-primary">
             <Trophy className="h-3 w-3" />
             {isLoading ? "Chargement..." : stats?.rank}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}