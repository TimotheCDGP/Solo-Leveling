import { Badge } from "@/components/ui/badge";
import { format, isPast, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  AlertTriangle, 
  Calendar, 
  ShieldAlert, 
  ShieldCheck, 
  Shield, 
  Clock 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Priority } from "@/types/goal";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Retourne un Badge avec icône pour la priorité
 */
export const getPriorityBadge = (priority: string | undefined | null) => {
  if (!priority) return <Badge variant="outline">Non définie</Badge>;

  switch (priority) {
    case "HIGH":
      return (
        <Badge className="bg-red-500 hover:bg-red-600 border-transparent text-white gap-1 pl-1.5">
          <ShieldAlert className="h-3.5 w-3.5" />
          Rang S (Haute)
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600 border-transparent text-white gap-1 pl-1.5">
           <Shield className="h-3.5 w-3.5" />
          Rang A (Moyenne)
        </Badge>
      );
    case "LOW":
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 border-transparent text-white gap-1 pl-1.5">
           <ShieldCheck className="h-3.5 w-3.5" />
          Rang B (Basse)
        </Badge>
      );
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
};

/**
 * Affiche la date limite avec icônes
 */
export const DeadlineDisplay = ({ dateStr }: { dateStr?: string | null }) => {
  if (!dateStr) {
    return (
        <span className="flex items-center gap-1.5 text-muted-foreground italic text-xs">
            <Clock className="h-3.5 w-3.5" /> 
            Pas de date limite
        </span>
    );
  }

  const date = new Date(dateStr);
  if (!isValid(date)) return null;

  const isOverdue = isPast(date);

  return (
    <span
      className={`flex items-center gap-1.5 text-sm font-medium ${
        isOverdue ? "text-red-500 font-bold" : "text-muted-foreground"
      }`}
    >
      {isOverdue ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Calendar className="h-4 w-4" />
      )}
      {isOverdue ? "En retard : " : "Pour le : "}
      {format(date, "d MMMM yyyy", { locale: fr })}
    </span>
  );
};

export const GOAL_COLORS = {
  GREEN: "#01c3a8",
  BLUE: "#1890ff",
  ORANGE: "#ffb741",
  RED: "#a63d2a",
  DARK_BG: "#151419",
  DARK_BORDER: "#232228",
};

// Mapper Priorité -> Couleur
export const getGoalColor = (priority: Priority) => {
  switch (priority) {
    case "HIGH": return GOAL_COLORS.RED;
    case "MEDIUM": return GOAL_COLORS.ORANGE;
    case "LOW": return GOAL_COLORS.GREEN;
    default: return GOAL_COLORS.BLUE;
  }
};