import { Target, Zap, Trophy, Infinity } from "lucide-react";
import type { DashboardStats } from "@/types/dashboard";

export function StatsCards({ kpis }: { kpis: DashboardStats }) {
  const cards = [
    { 
      title: "Objectifs", 
      value: kpis.activeGoals, 
      icon: Target, 
      color: "text-blue-500",
      description: "Objectifs actifs"
    },
    { 
      title: "Habitudes", 
      value: kpis.totalHabits, 
      icon: Infinity, 
      color: "text-emerald-500",
      description: "Rituels quotidiens"
    },
    { 
      title: "XP Totale", 
      value: `${kpis.xp.toLocaleString()}`, 
      icon: Zap, 
      color: "text-yellow-500",
      description: "Puissance accumulée"
    },
    { 
      title: "Record Série", // Changement de libellé
      value: `${kpis.bestStreak} jours`, // Utilisation de bestStreak
      icon: Trophy, // Icône Trophée pour le record
      color: "text-purple-500",
      description: "Meilleure performance"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-background border rounded-xl p-6 shadow-sm flex items-center justify-between transition-all hover:border-primary/20">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{card.title}</p>
            <p className="text-2xl font-bold tracking-tight">{card.value}</p>
            <p className="text-[10px] text-muted-foreground italic">{card.description}</p>
          </div>
          <div className={`p-3 rounded-full bg-muted/50 ${card.color}`}>
            <card.icon className="h-6 w-6" />
          </div>
        </div>
      ))}
    </div>
  );
}