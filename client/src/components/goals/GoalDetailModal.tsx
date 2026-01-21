import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"; 
import { Badge } from "@/components/ui/badge";

import type { Goal, Step, Priority } from "@/types/goal";
import { GoalStepsList } from "./GoalStepsList"; 
import { getPriorityBadge, DeadlineDisplay } from "@/lib/utils"; 
import { 
  Quote, CheckCircle2, RotateCcw, Loader2, CircleDashed, PlayCircle, Ban, 
  ChevronLeft, Pencil, Save, X, CalendarIcon,
} from "lucide-react";
import { GoalService } from "@/services/goal.service"; 
import { toast } from "sonner";

const GoalStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED',
} as const;
type GoalStatus = typeof GoalStatus[keyof typeof GoalStatus];

interface GoalDetailModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onGoalUpdated?: (updatedGoal: Goal) => void;
}

export function GoalDetailModal({ goal: initialGoal, isOpen, onClose, onGoalUpdated }: GoalDetailModalProps) {
  const [goal, setGoal] = useState<Goal | null>(initialGoal);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    description: string;
    priority: Priority;
    deadline: Date | undefined;
  }>({ description: "", priority: "MEDIUM", deadline: undefined });

  useEffect(() => {
    setGoal(initialGoal);
  }, [initialGoal]);

  const startEditing = () => {
    if (!goal) return;
    setEditForm({
      description: goal.description || "",
      priority: goal.priority,
      deadline: goal.deadline ? new Date(goal.deadline) : undefined,
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEdits = async () => {
    if (!goal) return;
    setIsLoading(true);
    try {
      const updatedGoal = await GoalService.update(goal.id, {
        description: editForm.description,
        priority: editForm.priority,
        deadline: editForm.deadline ? editForm.deadline.toISOString() : undefined 
      });

      setGoal(updatedGoal);
      if (onGoalUpdated) onGoalUpdated(updatedGoal);
      setIsEditing(false);
      toast.success("Modifications enregistrées");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };


  if (!goal) return null;

  const isDone = goal.status === GoalStatus.DONE;
  const isCancelled = goal.status === GoalStatus.CANCELLED;
  
  const handleStepsUpdate = (updatedSteps: Step[]) => {
      setGoal((prev) => prev ? { ...prev, steps: updatedSteps } : null);
      const newGoalData = { ...goal, steps: updatedSteps } as Goal;
      if (onGoalUpdated) onGoalUpdated(newGoalData);
  };

  const steps = goal.steps || [];
  const canValidate = steps.length === 0 || steps.every((s) => s.is_completed);

  const handleToggleDone = async () => {
    if (!isDone && !isCancelled && !canValidate) {
      toast.warning("Action impossible", { description: "Terminez les étapes d'abord !" });
      return; 
    }
    setIsLoading(true);
    const newStatus = (isDone || isCancelled) ? GoalStatus.IN_PROGRESS : GoalStatus.DONE;
    await updateStatusMain(newStatus, true);
    setIsLoading(false);
  };

  const handleSelectStatus = async (value: string) => {
    await updateStatusMain(value as GoalStatus, false);
  };

  const updateStatusMain = async (newStatus: GoalStatus, showToast: boolean) => {
    try {
      // @ts-ignore
      const updated = await GoalService.updateStatus(goal.id, newStatus);
      setGoal(updated);
      if (showToast && newStatus === GoalStatus.DONE) toast.success("Objectif validé ! 🎉");
      if (onGoalUpdated) onGoalUpdated(updated);
    } catch (e) { toast.error("Erreur update status"); }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[550px] p-0 flex flex-col gap-0 border-l">
        
        <SheetHeader className="p-6 pb-4 bg-background/50 backdrop-blur-sm z-10 border-b space-y-4">
           
           <div className="flex items-center justify-between -ml-2">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground gap-1">
                 <ChevronLeft className="h-5 w-5" /> Liste
              </Button>

              {!isEditing && !isDone && !isCancelled && (
                  <Button variant="ghost" size="icon" onClick={startEditing} title="Modifier">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
              )}
           </div>

           <div className="flex flex-col gap-4">
            <SheetTitle className="text-2xl font-bold text-primary tracking-tight leading-snug pr-8">
              {goal.title}
            </SheetTitle>
            
            <div className="flex flex-wrap items-center gap-3">
                 
                 {isEditing ? (
                   <Select 
                      value={editForm.priority} 
                      onValueChange={(v) => setEditForm({...editForm, priority: v as Priority})}
                   >
                     <SelectTrigger className="w-[140px] h-8">
                       <SelectValue placeholder="Priorité" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="LOW">Basse (Low)</SelectItem>
                       <SelectItem value="MEDIUM">Moyenne (Med)</SelectItem>
                       <SelectItem value="HIGH">Haute (High)</SelectItem>
                     </SelectContent>
                   </Select>
                 ) : (
                   getPriorityBadge(goal.priority)
                 )}

                 <Separator orientation="vertical" className="h-4" />
                 
                 {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-8 justify-start text-left font-normal",
                            !editForm.deadline && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {editForm.deadline ? format(editForm.deadline, "dd/MM/yyyy") : <span>Date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editForm.deadline}
                          onSelect={(d) => setEditForm({...editForm, deadline: d})}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                 ) : (
                   <DeadlineDisplay dateStr={goal.deadline} />
                 )}

                 <Separator orientation="vertical" className="h-4" />
                 
                 {isDone ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 gap-1 px-3 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Terminé
                    </Badge>
                 ) : (
                    <Select 
                        disabled={isEditing}
                        value={goal.status} 
                        onValueChange={handleSelectStatus}
                    >
                        <SelectTrigger className="h-7 w-[130px] text-xs font-medium border-dashed bg-transparent">
                             <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={GoalStatus.TODO}><div className="flex gap-2"><CircleDashed className="h-3.5 w-3.5"/> À faire</div></SelectItem>
                            <SelectItem value={GoalStatus.IN_PROGRESS}><div className="flex gap-2 text-blue-600"><PlayCircle className="h-3.5 w-3.5"/> En cours</div></SelectItem>
                            <SelectItem value={GoalStatus.CANCELLED}><div className="flex gap-2 text-red-600"><Ban className="h-3.5 w-3.5"/> Annulé</div></SelectItem>
                        </SelectContent>
                    </Select>
                 )}
            </div>

            {isEditing && (
                <div className="flex gap-2 mt-2 animate-in fade-in slide-in-from-top-2">
                    <Button size="sm" onClick={saveEdits} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2"/> : <Save className="h-3 w-3 mr-2"/>}
                        Sauvegarder
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancelEditing} disabled={isLoading}>
                        <X className="h-3 w-3 mr-2"/> Annuler
                    </Button>
                </div>
            )}
          </div>
        </SheetHeader>

        {/* CORPS */}
        <ScrollArea className="flex-1 h-full">
         <div className="p-6 space-y-8 pb-20">
             
             {/* --- 3. DESCRIPTION --- */}
             {isEditing ? (
                 <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
                    <Textarea 
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="min-h-[100px] bg-background"
                        placeholder="Décris ton objectif..."
                    />
                 </div>
             ) : (
                goal.description && (
                  <div className="relative overflow-hidden rounded-xl bg-muted/40 p-5 border border-border/50">
                    <div className="flex gap-3">
                        <Quote className="h-5 w-5 opacity-40 shrink-0 text-primary mt-0.5" />
                        <SheetDescription className="text-base text-foreground/80 leading-relaxed font-medium whitespace-pre-wrap">
                            {goal.description}
                        </SheetDescription>
                    </div>
                  </div>
                )
             )}

            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Plan d'action</h4>
                </div>
                
                <div className={(isDone || isCancelled) ? "opacity-50 pointer-events-none grayscale" : ""}>
                    <GoalStepsList 
                        goalId={goal.id} 
                        initialSteps={goal.steps || []} 
                        goalStatus={goal.status}
                        onStepsChange={handleStepsUpdate}
                    />
                </div>
            </div>
         </div>
        </ScrollArea>

        {/* FOOTER */}
        {!isEditing && ( // On cache le footer de validation pendant qu'on édite les infos
            <SheetFooter className="p-4 border-t bg-background/95 backdrop-blur flex flex-col gap-3">

                <Button 
                    className={`w-full h-12 text-base font-semibold shadow-md transition-all ${
                        (isDone || isCancelled) ? "bg-muted text-muted-foreground" : "bg-primary hover:bg-primary/90"
                    }`}
                    onClick={handleToggleDone}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 
                     (isDone || isCancelled) ? <><RotateCcw className="mr-2 h-5 w-5" /> Rouvrir l'objectif</> : 
                     <><CheckCircle2 className="mr-2 h-5 w-5" /> Valider l'objectif</>
                    }
                </Button>
            </SheetFooter>
        )}

      </SheetContent>
    </Sheet>
  );
}