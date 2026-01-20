import { 
  Calendar, Target, 
  Dumbbell, Wallet, GraduationCap, Heart, Briefcase, Layers,
  ArrowDown, Minus, ArrowUp
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Goal, Priority } from "@/types/goal";

const categoryIcons: Record<string, React.ReactNode> = {
  Sport: <Dumbbell className="h-3 w-3" />,
  Finance: <Wallet className="h-3 w-3" />,
  Education: <GraduationCap className="h-3 w-3" />,
  Santé: <Heart className="h-3 w-3" />,
  Carrière: <Briefcase className="h-3 w-3" />,
  Autre: <Layers className="h-3 w-3" />,
};

const priorityConfig: Record<Priority, { icon: React.ReactNode; style: string }> = {
  HIGH: { 
    icon: <ArrowUp className="h-3 w-3" />, 
    style: "bg-red-500 hover:bg-red-600 text-white border-transparent" 
  },
  MEDIUM: { 
    icon: <Minus className="h-3 w-3" />, 
    style: "bg-orange-400 hover:bg-orange-500 text-white border-transparent" 
  },
  LOW: { 
    icon: <ArrowDown className="h-3 w-3" />, 
    style: "bg-green-500 hover:bg-green-600 text-white border-transparent" 
  },
};

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Aucune date";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const priorityInfo = priorityConfig[goal.priority];

  const CategoryIcon = goal.category && categoryIcons[goal.category] 
    ? categoryIcons[goal.category] 
    : <Target className="h-3 w-3" />;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group border-l-4" style={{ borderLeftColor: goal.priority === 'HIGH' ? '#ef4444' : goal.priority === 'MEDIUM' ? '#fb923c' : '#22c55e' }}>
        {/* --- EN-TÊTE --- */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
          {goal.title}
        </CardTitle>
        <Badge className={`ml-2 shrink-0 gap-1 pl-1.5 pr-2 ${priorityInfo.style}`}>
          {priorityInfo.icon}
          {goal.priority}
        </Badge>
      </CardHeader>

      {/* --- CORPS --- */}
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {goal.description || "Pas de description pour cet objectif."}
        </p>
      </CardContent>

      {/* --- PIED --- */}
      <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between items-center border-t bg-muted/20 p-4 mt-auto">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-primary/70" />
          <span>{formatDate(goal.deadline || goal.startDate)}</span>
        </div>
        
        {goal.category && (
          <div className="flex items-center gap-1.5 font-medium text-foreground/80 bg-background px-2 py-1 rounded-full border shadow-sm">
            {CategoryIcon}
            <span>{goal.category}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}