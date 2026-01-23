"use client"

import { useState, useEffect } from "react";
import { parseISO, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";

import { 
  Quote, CheckCircle2, RotateCcw, Loader2, 
  ChevronLeft, Pencil, Save, Flame, Trash2,
  Heart, Zap, Leaf, Brain, LayoutGrid, Plus, Lock, Check
} from "lucide-react";

import { HabitService } from "@/services/habit.service"; 
import { showBadgeUnlock } from "@/components/badges/BadgeNotification";
import { toast } from "sonner";
import type { Habit } from "@/types/habit";

interface HabitDetailsModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedHabit?: Habit) => void;
}

export function HabitDetailsModal({ habit: initialHabit, isOpen, onClose, onUpdate }: HabitDetailsModalProps) {
  const [habit, setHabit] = useState<Habit | null>(initialHabit);
  const [isLoading, setIsLoading] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [isAddingStep, setIsAddingStep] = useState(false);

  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [tempStepTitle, setTempStepTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    category: string;
  }>({ title: "", description: "", category: "Santé" });

  useEffect(() => {
    if (initialHabit) {
      setHabit(initialHabit);
    }
  }, [initialHabit]);

  if (!habit) return null;

  const isDone = habit.isCompletedToday;
  const hasSteps = (habit.steps?.length || 0) > 0;
  const allStepsCompleted = habit.steps?.every(s => s.isCompleted) ?? false;
  const canValidateHabit = !hasSteps || allStepsCompleted || isDone;

  const startEditing = () => {
    setEditForm({ title: habit.title, description: habit.description || "", category: habit.category });
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const saveEdits = async () => {
    setIsLoading(true);
    try {
      const updatedHabit = await HabitService.update(habit.id, editForm) as Habit;
      setHabit(updatedHabit);
      onUpdate(updatedHabit);
      setIsEditing(false);
      toast.success("Système mis à jour");
    } catch (error) { toast.error("Erreur sauvegarde"); }
    finally { setIsLoading(false); }
  };

  const handleToggleHabit = async () => {
    if (!canValidateHabit) {
      toast.error("Mission incomplète", {
        description: "Toutes les étapes doivent être validées."
      });
      return;
    }

    setIsLoading(true);
    try {
      // Destructuration de la réponse { habit, newBadges }
      const { habit: updatedHabit, newBadges } = await HabitService.toggleHabit(habit.id);
      
      setHabit(updatedHabit);
      onUpdate(updatedHabit); 

      // Affichage des badges si présents
      if (newBadges && newBadges.length > 0) {
        newBadges.forEach((badge: any) => showBadgeUnlock(badge.name));
      }
      
      if (updatedHabit.isCompletedToday) {
        toast.success(`Mission accomplie ! (+${habit.xpReward} XP)`);
      } else {
        toast.info("Validation annulée");
      }
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || "Erreur système";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStep = async (stepId: string) => {
    if (!habit) return;
    try {
        const { habit: updatedHabit, newBadges } = await HabitService.toggleStep(stepId);
        setHabit(updatedHabit);
        onUpdate(updatedHabit);

        if (newBadges && newBadges.length > 0) {
          newBadges.forEach((badge: any) => showBadgeUnlock(badge.name));
        }
    } catch (e) {
        toast.error("Erreur de mise à jour de l'étape");
    }
  };

  const saveStepTitle = async (stepId: string) => {
    if (!tempStepTitle.trim() || !habit) {
        setEditingStepId(null);
        return;
    }
    try {
        await HabitService.updateStep(stepId, tempStepTitle);
        const updatedSteps = habit.steps.map(s => s.id === stepId ? { ...s, title: tempStepTitle } : s);
        const newHabitState = { ...habit, steps: updatedSteps };
        setHabit(newHabitState);
        onUpdate(newHabitState);
        setEditingStepId(null);
    } catch (e) { toast.error("Erreur modification"); }
  };

  const handleAddStep = async () => {
    if (!newStepTitle.trim()) return;
    setIsAddingStep(true);
    try {
        const newStep = await HabitService.addStep(habit.id, newStepTitle);
        const updatedHabit = { ...habit, steps: [...(habit.steps || []), newStep], isCompletedToday: false };
        setHabit(updatedHabit);
        onUpdate(updatedHabit);
        setNewStepTitle("");
    } catch (e) { toast.error("Erreur ajout"); } 
    finally { setIsAddingStep(false); }
  };

  const handleDeleteStep = async (stepId: string) => {
    try {
        await HabitService.deleteStep(stepId);
        const updatedSteps = habit.steps.filter(s => s.id !== stepId);
        const allCompleted = updatedSteps.length > 0 && updatedSteps.every(s => s.isCompleted);
        const updatedHabit = { ...habit, steps: updatedSteps, isCompletedToday: allCompleted };
        setHabit(updatedHabit);
        onUpdate(updatedHabit);
    } catch (e) { toast.error("Erreur suppression"); }
  };

  const completedDates = habit.habitLogs?.map(log => 
    typeof log.date === 'string' ? parseISO(log.date) : new Date(log.date)
  ) || [];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[550px] p-0 flex flex-col gap-0 border-l font-inter">
        
        <SheetHeader className="p-6 pb-4 bg-background/50 backdrop-blur-sm z-10 border-b space-y-4">
            <div className="flex items-center justify-between -ml-2">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground gap-1 uppercase text-[10px] font-bold tracking-widest">
                 <ChevronLeft className="h-4 w-4" /> Retour
              </Button>
              {!isEditing && (
                  <Button variant="ghost" size="icon" onClick={startEditing} title="Modifier">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
              )}
            </div>

            <div className="flex flex-col gap-4">
             {isEditing ? (
                <div className="flex flex-col gap-3">
                   <Input 
                    value={editForm.title} 
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="text-lg font-bold h-10 border-primary/20 focus-visible:ring-primary"
                   />
                   <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdits} disabled={isLoading}>
                         {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Enregistrer
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEditing}> Annuler </Button>
                   </div>
                </div>
             ) : (
                <SheetTitle className="text-3xl font-oswald font-black uppercase italic tracking-tighter text-primary">
                {habit.title}
                </SheetTitle>
             )}
            
            <div className="flex flex-wrap items-center gap-3">
                 {!isEditing && (
                   <Badge variant="outline" className="gap-2 px-3 py-1 font-bold uppercase text-[10px] tracking-widest bg-background">
                       {getCategoryIcon(habit.category)} {habit.category}
                   </Badge>
                 )}
                 <Separator orientation="vertical" className="h-4" />
                 <Badge variant="secondary" className={cn("gap-1.5 px-3 py-1 font-oswald italic font-bold text-sm", habit.currentStreak > 0 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground")}>
                    <Flame className={cn("h-3.5 w-3.5", habit.currentStreak > 0 && "fill-orange-500 text-orange-500")} /> 
                    {habit.currentStreak} JOURS
                 </Badge>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
         <div className="p-6 space-y-8 pb-24">
            <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Information Mission</h4>
                {!isEditing ? (
                    habit.description && (
                        <div className="relative overflow-hidden rounded-xl bg-muted/40 p-5 border">
                            <div className="flex gap-3">
                                <Quote className="h-5 w-5 opacity-40 shrink-0 text-primary mt-0.5" />
                                <SheetDescription className="text-base text-foreground/80 leading-relaxed italic">
                                    {habit.description}
                                </SheetDescription>
                            </div>
                        </div>
                    )
                ) : (
                     <Textarea 
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="min-h-[100px]"
                        placeholder="Objectif de la mission..."
                     />
                )}
            </div>

            <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Archives de Progression</h4>
                <div className="flex justify-center bg-card rounded-xl p-4 border shadow-sm">
                    <Calendar
                        mode="single"
                        selected={new Date()}
                        locale={fr}
                        components={{
                            Day: ({ day, ...props }: any) => {
                                const date = day.date; 
                                const isCompleted = completedDates.some(cd => isSameDay(date, cd));
                                const isToday = isSameDay(date, new Date());
                                return (
                                    <div className="relative w-full h-full flex items-center justify-center p-1">
                                        <button 
                                          {...props} 
                                          className={cn(
                                            "h-9 w-9 p-0 font-normal flex items-center justify-center rounded-md transition-all", 
                                            isCompleted ? "border-2 border-orange-500 bg-orange-50 text-orange-700 font-bold" : "hover:bg-muted", 
                                            isToday && !isCompleted && "border border-primary text-primary"
                                          )} 
                                          type="button"
                                        >
                                            <span>{date.getDate()}</span>
                                        </button>
                                        {isCompleted && <Flame className="absolute -top-1 -right-1 h-4 w-4 text-orange-500 fill-orange-500 animate-in zoom-in" />}
                                    </div>
                                );
                            }
                        }}
                        className="rounded-md"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Objectifs Secondaires</h4>
                  <Badge variant="outline" className="text-[10px] h-5 font-bold">
                    {habit.steps?.filter(s => s.isCompleted).length}/{habit.steps?.length || 0}
                  </Badge>
                </div>
                <div className="space-y-2">
                    {habit.steps?.map((step) => (
                        <div key={step.id} className={cn(
                          "group flex items-center justify-between p-3 rounded-lg border bg-card transition-all",
                          editingStepId === step.id ? "border-primary shadow-sm" : "hover:border-primary/50"
                        )}>
                            <div className="flex items-center gap-3 flex-1">
                                {editingStepId !== step.id && (
                                  <Checkbox 
                                      checked={step.isCompleted} 
                                      onCheckedChange={() => handleToggleStep(step.id)} 
                                      className="size-5 border-2"
                                  />
                                )}
                                
                                {editingStepId === step.id ? (
                                    <div className="flex items-center gap-2 w-full">
                                        <Input 
                                            autoFocus
                                            value={tempStepTitle}
                                            onChange={(e) => setTempStepTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveStepTitle(step.id);
                                                if (e.key === 'Escape') setEditingStepId(null);
                                            }}
                                            className="h-8 py-1 flex-1 border-none focus-visible:ring-0 shadow-none p-0 bg-transparent font-medium"
                                        />
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600" onClick={() => saveStepTitle(step.id)}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div 
                                        className="flex items-center gap-2 flex-1 cursor-pointer"
                                        onClick={() => {
                                            setEditingStepId(step.id);
                                            setTempStepTitle(step.title);
                                        }}
                                    >
                                        <span className={cn("text-sm font-semibold tracking-tight transition-all", step.isCompleted && "line-through text-muted-foreground opacity-50")}>
                                            {step.title}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            {editingStepId !== step.id && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity" onClick={() => handleDeleteStep(step.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <div className="flex gap-2 mt-4">
                        <Input value={newStepTitle} onChange={(e) => setNewStepTitle(e.target.value)} placeholder="Ajouter une étape..." className="h-10 border-dashed" onKeyDown={(e) => e.key === 'Enter' && handleAddStep()} />
                        <Button size="icon" onClick={handleAddStep} disabled={!newStepTitle || isAddingStep} className="size-10 shrink-0">
                            {isAddingStep ? <Loader2 className="h-4 w-4 animate-spin"/> : <Plus className="h-5 w-5"/>}
                        </Button>
                    </div>
                </div>
            </div>
         </div>
        </ScrollArea>

        {!isEditing && (
            <SheetFooter className="p-6 border-t bg-background/95 backdrop-blur-md sticky bottom-0">
                <Button 
                    className={cn(
                        "w-full h-14 text-lg font-oswald uppercase italic font-black tracking-widest shadow-xl transition-all duration-300",
                        isDone ? "bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-600" 
                               : !canValidateHabit ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" 
                               : "bg-primary text-primary-foreground border-b-4 border-primary-foreground/20"
                    )}
                    onClick={handleToggleHabit}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 
                     isDone ? <><RotateCcw className="mr-3 h-5 w-5" /> Réinitialiser</> : 
                     !canValidateHabit ? <><Lock className="mr-3 h-5 w-5" /> Checklist incomplète</> :
                     <><CheckCircle2 className="mr-3 h-5 w-5" /> Compléter Mission</>
                    }
                </Button>
            </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function getCategoryIcon(cat: string) {
    switch(cat) {
        case "Santé": return <Heart className="h-3.5 w-3.5 text-red-500" />;
        case "Productivité": return <Zap className="h-3.5 w-3.5 text-amber-500" />;
        case "Bien-être": return <Leaf className="h-3.5 w-3.5 text-green-500" />;
        case "Apprentissage": return <Brain className="h-3.5 w-3.5 text-purple-500" />;
        default: return <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />;
    }
}