import { useMemo } from "react";
import { formatDistanceToNow, isPast } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Calendar, 
  Dumbbell, Wallet, GraduationCap, Heart, Briefcase, Layers,
  Clock,
  CheckCircle2,
  ListChecks,
  PlayCircle,
  CircleDashed,
  Ban
} from "lucide-react";
import type { Goal } from "@/types/goal";
import { getGoalColor } from "@/lib/utils"; 

const categoryIcons: Record<string, React.ReactNode> = {
  Sport: <Dumbbell className="h-5 w-5" />,
  Finance: <Wallet className="h-5 w-5" />,
  Education: <GraduationCap className="h-5 w-5" />,
  Santé: <Heart className="h-5 w-5" />,
  Carrière: <Briefcase className="h-5 w-5" />,
  Autre: <Layers className="h-5 w-5" />,
};

const statusConfig = {
  TODO: { label: "À faire", icon: CircleDashed },
  IN_PROGRESS: { label: "En cours", icon: PlayCircle },
  DONE: { label: "Terminé", icon: CheckCircle2 },
  CANCELLED: { label: "Annulé", icon: Ban },
};

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
}

export function GoalCard({ goal, onClick }: GoalCardProps) {
  const mainColor = getGoalColor(goal.priority);
  
  const { progress, stepCountText } = useMemo(() => {
    const steps = goal.steps || [];
    const total = steps.length;
    const completed = steps.filter(s => s.is_completed).length;

    if (goal.status === 'DONE') {
      return { 
        progress: 100, 
        stepCountText: total > 0 ? `${total}/${total} étape${total > 1 ? 's' : ''}` : "Validé" 
      };
    }

    if (total === 0) return { progress: 0, stepCountText: "0 étape" };
    
    const prog = Math.round((completed / total) * 100);
    return { 
      progress: prog, 
      stepCountText: `${completed}/${total} étape${total > 1 ? 's' : ''}` 
    };
  }, [goal]);

  const deadlineText = useMemo(() => {
    if (!goal.deadline) return "Pas de date limite";
    const date = new Date(goal.deadline);
    if (isPast(date) && goal.status !== 'DONE') return "En retard";
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }, [goal.deadline, goal.status]);

  const CategoryIcon = (goal.category && categoryIcons[goal.category]) 
    ? categoryIcons[goal.category] 
    : <Layers className="h-5 w-5" />;

  const currentStatus = statusConfig[goal.status] || statusConfig.TODO;
  const StatusIcon = currentStatus.icon;

  return (
    <div 
      onClick={onClick}
      className="group relative w-full h-full min-h-[18rem] rounded-[2rem] cursor-pointer transition-all duration-300 hover:-translate-y-2"
      style={{
        boxShadow: `0 10px 30px -10px ${mainColor}40`,
      }}
    >
       <div 
         className="absolute inset-0 rounded-[2rem] opacity-20 dark:opacity-100 transition-opacity"
         style={{
            background: `linear-gradient(135deg, transparent, ${mainColor})`
         }}
       />

      <div 
        className="relative h-full w-full rounded-[1.9rem] overflow-hidden flex flex-col bg-card border border-border/50 dark:border-transparent m-[1px] shadow-sm"
      >
        
        <div className="flex items-center justify-between p-6 pb-2">
            <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(goal.startDate || Date.now()).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric'})}
            </div>

            <div style={{ color: mainColor }} className="opacity-90 bg-muted/20 p-2 rounded-full">
                {CategoryIcon}
            </div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center text-center px-6 py-2">
            <h3 className="text-xl font-bold text-foreground tracking-tight line-clamp-2 mb-1 capitalize">
                {goal.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-1 mb-6">
                {goal.category || "Objectif personnel"}
            </p>

            <div className="w-full mt-2">
                <div className="flex justify-between text-xs font-semibold text-foreground/80 mb-2 uppercase tracking-wider">
                    <span className="flex items-center gap-1 opacity-70">
                        <ListChecks className="h-3 w-3" />
                        {stepCountText}
                    </span>
                    <span>{progress}%</span>
                </div>
                
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ 
                            width: `${progress}%`,
                            background: mainColor,
                            boxShadow: `0 0 10px ${mainColor}`
                        }} 
                    />
                </div>
            </div>
        </div>

        <div className="mt-auto bg-muted/30 border-t border-border p-5 flex items-center justify-between">
            
            <div 
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                style={{ background: mainColor }}
            >
                 <StatusIcon className="h-3 w-3" />
                 <span>{currentStatus.label}</span>
            </div>

            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 opacity-70" />
                <span className="truncate max-w-[80px]">{deadlineText}</span>
            </div>

        </div>
      </div>
    </div>
  );
}