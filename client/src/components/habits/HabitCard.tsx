import { useState } from "react";
import { 
  Flame, ChevronDown, ChevronUp, Check, 
  Heart, Zap, Leaf, Brain, LayoutGrid
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible, CollapsibleContent
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { HabitService } from "@/services/habit.service";
import type { Habit } from "@/types/habit";
import { toast } from "sonner";
import { HabitDetailsModal } from "./HabitDetailsModal";

interface HabitCardProps {
  habit: Habit;
  onRefresh: () => void;
}

export function HabitCard({ habit: initialHabit, onRefresh }: HabitCardProps) {
  const [habit, setHabit] = useState(initialHabit);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // guard against undefined steps coming from API/client
  const steps = habit.steps ?? [];
  const isRoutine = steps.length > 0;
  const totalSteps = steps.length;
  const completedSteps = steps.filter(s => s.isCompleted).length;
  // avoid division by zero with a safe fallback
  const progress = isRoutine ? (completedSteps / (totalSteps || 1)) * 100 : (habit.isCompletedToday ? 100 : 0);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
        case "Santé": return <Heart className="h-3 w-3" />;
        case "Productivité": return <Zap className="h-3 w-3" />;
        case "Bien-être": return <Leaf className="h-3 w-3" />;
        case "Apprentissage": return <Brain className="h-3 w-3" />;
        default: return <LayoutGrid className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
        case "Santé": return "text-red-500 bg-red-500/10 border-red-200";
        case "Productivité": return "text-amber-500 bg-amber-500/10 border-amber-200";
        case "Bien-être": return "text-green-500 bg-green-500/10 border-green-200";
        case "Apprentissage": return "text-purple-500 bg-purple-500/10 border-purple-200";
        default: return "text-slate-500 bg-slate-500/10 border-slate-200";
    }
  };

  const handleToggleHabit = async () => {
    if (isLoading) return;
    const oldState = habit.isCompletedToday;

    setIsLoading(true);
    setHabit((prev) => ({
      ...prev,
      isCompletedToday: !prev.isCompletedToday,
      currentStreak: !prev.isCompletedToday ? prev.currentStreak + 1 : Math.max(0, prev.currentStreak - 1),
    }));

    try {
      await HabitService.toggleHabit(habit.id);
      onRefresh();
      if (!oldState) toast.success(`Habitude validée ! (+${habit.xpReward} XP) 🔥`);
    } catch (err) {
      // log to help debugging while avoiding unused variable lint errors
  console.error(err);
      setHabit(initialHabit);
      toast.error("Erreur connexion");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStep = async (stepId: string) => {
    // use the current steps from habit (guarded) to avoid undefined issues
    const currentSteps = habit.steps ?? [];
    const newSteps = currentSteps.map((s) => (s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s));
    const newCompletedCount = newSteps.filter((s) => s.isCompleted).length;
    const totalStepsLocal = newSteps.length;
    const isNowFullyDone = newCompletedCount === totalStepsLocal;
    const wasFullyDone = habit.isCompletedToday;

    setHabit((prev) => ({
      ...prev,
      steps: newSteps,
      isCompletedToday: isNowFullyDone,
      currentStreak:
        isNowFullyDone && !wasFullyDone
          ? prev.currentStreak + 1
          : !isNowFullyDone && wasFullyDone
          ? Math.max(0, prev.currentStreak - 1)
          : prev.currentStreak,
    }));

    try {
      const res = await HabitService.toggleStep(stepId);
      if (res.parentCompleted && !wasFullyDone) {
        toast.success(`Routine complétée ! (+${habit.xpReward} XP) 🔥`);
        onRefresh();
      } else if (!res.parentCompleted && wasFullyDone) {
        onRefresh();
      }
    } catch (err) {
  console.error(err);
      setHabit(initialHabit);
    }
  };

  return (
    <>
      <div 
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md cursor-pointer",
          habit.isCompletedToday ? "border-green-500/30 bg-green-500/5" : "border-border"
        )}
        onClick={() => setIsDetailsOpen(true)}
      >
        
        <div className="flex items-center justify-between p-4 pb-2">
            <Badge variant="outline" className={cn("gap-1.5 font-medium border", getCategoryColor(habit.category))}>
                {getCategoryIcon(habit.category)}
                {habit.category}
            </Badge>

            <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors border",
                habit.currentStreak > 0 
                  ? "bg-orange-100 text-orange-600 border-orange-200" 
                  : "bg-muted text-muted-foreground border-transparent"
            )}>
                <Flame className={cn("h-3.5 w-3.5", habit.currentStreak > 0 && "fill-orange-500 text-orange-500")} />
                <span>{habit.currentStreak} <span className="hidden sm:inline">Jours</span></span>
            </div>
        </div>

        <div className="px-4 pb-4 space-y-1">
            <h4 className={cn("font-bold text-lg leading-tight", habit.isCompletedToday && "text-muted-foreground line-through decoration-2 decoration-green-500/50")}>
                {habit.title}
            </h4>
            {habit.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {habit.description}
                </p>
            )}
        </div>

        <div className="mt-auto border-t bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-3">
                
                <div 
                    className="flex items-center gap-3 cursor-pointer group/checkbox"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isRoutine) handleToggleHabit();
                        else setIsOpen(!isOpen);
                    }}
                >
                    <div className="relative shrink-0">
                         {isRoutine ? (
                            <div className="relative flex h-9 w-9 items-center justify-center bg-background rounded-full border shadow-sm group-hover/checkbox:scale-105 transition-transform">
                               <div className="absolute inset-0 rounded-full border-2 border-muted" />
                               <div 
                                 className={cn("absolute inset-0 rounded-full border-2 transition-all duration-500", 
                                    habit.isCompletedToday ? "border-green-500" : "border-primary"
                                 )}
                                 style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }} 
                               />
                               {habit.isCompletedToday ? 
                                 <Check className="h-5 w-5 text-green-600 animate-in zoom-in" /> :
                                 <span className="text-[10px] font-bold text-primary">{Math.round(progress)}%</span>
                               }
                            </div>
                        ) : (
                            <div className={cn(
                                "h-9 w-9 rounded-full border-2 flex items-center justify-center shadow-sm transition-all duration-300 group-hover/checkbox:scale-105",
                                habit.isCompletedToday 
                                    ? "bg-green-500 border-green-500 text-white" 
                                    : "bg-background border-muted-foreground/30 hover:border-primary"
                            )}>
                                {habit.isCompletedToday && <Check className="h-5 w-5 animate-in zoom-in" />}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <span className={cn(
                            "text-sm font-bold transition-colors",
                            habit.isCompletedToday ? "text-green-600" : "text-foreground group-hover/checkbox:text-primary"
                        )}>
                            {habit.isCompletedToday ? "Mission accomplie pour aujourd'hui" : (isRoutine ? "Continuer la routine" : "Passer à l'action")}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                            {habit.isCompletedToday ? "Bien joué !" : `Gain: +${habit.xpReward} XP`}
                        </span>
                    </div>
                </div>

                {isRoutine && (
                     <Button 
                        variant="ghost" size="sm" 
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(!isOpen);
                        }}
                     >
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                     </Button>
                )}
            </div>
        </div>

        {isRoutine && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleContent className="animate-collapsible-down overflow-hidden bg-muted/30 border-t">
                  <div className="p-2 space-y-1">
                      {habit.steps.map((step) => (
                          <div 
                              key={step.id} 
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-background transition-colors cursor-pointer group/step"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleStep(step.id);
                              }}
                          >
                              <Checkbox 
                                  id={step.id}
                                  checked={step.isCompleted} 
                                  className="h-5 w-5 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                              />
                              <label htmlFor={step.id} className={cn(
                                  "text-sm flex-1 cursor-pointer select-none transition-all",
                                  step.isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                              )}>
                                  {step.title}
                              </label>
                          </div>
                      ))}
                  </div>
              </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      <HabitDetailsModal 
        habit={habit}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdate={(updatedHabit) => {
            if (updatedHabit) {
                setHabit(updatedHabit);
            }
            onRefresh();
        }}
      />
    </>
  );
}