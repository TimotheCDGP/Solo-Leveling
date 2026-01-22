import { useState, useEffect } from "react";
import { format, parseISO, isSameDay } from "date-fns";
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
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"; 
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";

import { 
  Quote, CheckCircle2, RotateCcw, Loader2, 
  ChevronLeft, Pencil, Save, X, Flame, Trash2,
  Heart, Zap, Leaf, Brain, LayoutGrid, Calendar as CalendarIcon, Plus, Check
} from "lucide-react";

import { HabitService } from "@/services/habit.service"; 
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

  // État pour l'édition inline des steps
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [tempStepTitle, setTempStepTitle] = useState("");

  useEffect(() => {
    setHabit(initialHabit);
  }, [initialHabit]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    category: string;
  }>({ title: "", description: "", category: "Santé" });

  const startEditing = () => {
    if (!habit) return;
    setEditForm({ title: habit.title, description: habit.description || "", category: habit.category });
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const saveEdits = async () => {
    if (!habit) return;
    setIsLoading(true);
    try {
      const updatedData = await HabitService.update(habit.id, editForm);
      const newHabitState = { ...habit, ...updatedData };
      setHabit(newHabitState);
      onUpdate(newHabitState);
      setIsEditing(false);
      toast.success("Modifications enregistrées");
    } catch (error) { toast.error("Erreur sauvegarde"); }
    finally { setIsLoading(false); }
  };

  const handleToggleHabit = async () => {
    if (!habit) return;
    setIsLoading(true);
    try {
        await HabitService.toggleHabit(habit.id);
        const newStatus = !habit.isCompletedToday;
        const updatedHabit: Habit = { 
            ...habit, 
            isCompletedToday: newStatus,
            currentStreak: newStatus ? habit.currentStreak + 1 : Math.max(0, habit.currentStreak - 1),
            habitLogs: newStatus 
                ? [...(habit.habitLogs || []), { id: 'temp', date: new Date().toISOString(), isCompleted: true }]
                : (habit.habitLogs || []).filter(log => !isSameDay(parseISO(log.date), new Date()))
        };
        setHabit(updatedHabit);
        onUpdate(updatedHabit);
        if(newStatus) toast.success(`Validé ! (+${habit.xpReward} XP)`);
    } catch (e) { toast.error("Erreur connexion"); } 
    finally { setIsLoading(false); }
  };

  const handleToggleStep = async (stepId: string) => {
    if (!habit || editingStepId) return;
    const updatedSteps = habit.steps.map(s => s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s);
    const allStepsCompleted = updatedSteps.every(s => s.isCompleted);
    const wasCompleted = habit.isCompletedToday;
    const updatedHabit = { 
        ...habit, 
        steps: updatedSteps,
        isCompletedToday: allStepsCompleted,
        currentStreak: (allStepsCompleted && !wasCompleted) ? habit.currentStreak + 1 : 
                       (!allStepsCompleted && wasCompleted) ? Math.max(0, habit.currentStreak - 1) : habit.currentStreak,
        habitLogs: allStepsCompleted
            ? [...(habit.habitLogs || []), { id: 'temp', date: new Date().toISOString(), isCompleted: true }]
            : (habit.habitLogs || []).filter(log => !isSameDay(parseISO(log.date), new Date()))
    };
    setHabit(updatedHabit);
    onUpdate(updatedHabit);
    try { await HabitService.toggleStep(stepId); } 
    catch (e) { toast.error("Erreur étape"); setHabit(habit); }
  };

  const saveStepTitle = async (stepId: string) => {
    if (!tempStepTitle.trim() || !habit) {
        setEditingStepId(null);
        return;
    }
    try {
        await HabitService.updateStep(stepId, tempStepTitle);
        const updatedSteps = habit.steps.map(s => s.id === stepId ? { ...s, title: tempStepTitle } : s);
        const updatedHabit = { ...habit, steps: updatedSteps };
        setHabit(updatedHabit);
        onUpdate(updatedHabit);
        setEditingStepId(null);
    } catch (e) {
        toast.error("Erreur modification");
    }
  };

  const handleAddStep = async () => {
    if (!habit || !newStepTitle.trim()) return;
    setIsAddingStep(true);
    try {
        const newStep = await HabitService.addStep(habit.id, newStepTitle);
        const updatedHabit = { ...habit, steps: [...(habit.steps || []), newStep], isCompletedToday: false };
        setHabit(updatedHabit);
        setNewStepTitle("");
        onUpdate(updatedHabit);
    } catch (e) { toast.error("Erreur ajout"); } 
    finally { setIsAddingStep(false); }
  };

  const handleDeleteStep = async (stepId: string) => {
    if (!habit) return;
    try {
        await HabitService.deleteStep(stepId);
        const updatedSteps = habit.steps.filter(s => s.id !== stepId);
        const allCompleted = updatedSteps.length > 0 && updatedSteps.every(s => s.isCompleted);
        const updatedHabit = { ...habit, steps: updatedSteps, isCompletedToday: allCompleted };
        setHabit(updatedHabit);
        onUpdate(updatedHabit);
    } catch (e) { toast.error("Erreur suppression"); }
  };

  if (!habit) return null;

  const isDone = habit.isCompletedToday;
  const completedDates = habit.habitLogs?.map(log => parseISO(log.date)) || [];

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
        case "Santé": return <Heart className="h-3.5 w-3.5 text-red-500" />;
        case "Productivité": return <Zap className="h-3.5 w-3.5 text-amber-500" />;
        case "Bien-être": return <Leaf className="h-3.5 w-3.5 text-green-500" />;
        case "Apprentissage": return <Brain className="h-3.5 w-3.5 text-purple-500" />;
        default: return <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[550px] p-0 flex flex-col gap-0 border-l">
        
        {/* HEADER */}
        <SheetHeader className="p-6 pb-4 bg-background/50 backdrop-blur-sm z-10 border-b space-y-4">
           <div className="flex items-center justify-between -ml-2">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground gap-1">
                 <ChevronLeft className="h-5 w-5" /> Liste
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
                         {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Sauvegarder
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEditing} disabled={isLoading}> Annuler </Button>
                   </div>
                </div>
            ) : (
                <SheetTitle className="text-2xl font-bold text-primary tracking-tight leading-snug">
                {habit.title}
                </SheetTitle>
            )}
            
            <div className="flex flex-wrap items-center gap-3">
                 {isEditing ? (
                   <Select value={editForm.category} onValueChange={(v) => setEditForm({...editForm, category: v})}>
                     <SelectTrigger className="w-[140px] h-8"><SelectValue placeholder="Catégorie" /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Santé">Santé</SelectItem>
                       <SelectItem value="Productivité">Productivité</SelectItem>
                       <SelectItem value="Bien-être">Bien-être</SelectItem>
                       <SelectItem value="Apprentissage">Apprentissage</SelectItem>
                       <SelectItem value="Autre">Autre</SelectItem>
                     </SelectContent>
                   </Select>
                 ) : (
                   <Badge variant="outline" className="gap-2 px-3 py-1 font-normal bg-background">
                       {getCategoryIcon(habit.category)} {habit.category}
                   </Badge>
                 )}
                 <Separator orientation="vertical" className="h-4" />
                 <Badge variant="secondary" className={cn("gap-1.5 px-3 py-1 font-bold", habit.currentStreak > 0 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground")}>
                    <Flame className={cn("h-3.5 w-3.5", habit.currentStreak > 0 && "fill-orange-500 text-orange-500")} /> 
                    {habit.currentStreak} Jours
                 </Badge>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 h-full">
         <div className="p-6 space-y-8 pb-20">
            
            {/* DESCRIPTION */}
            {!isEditing && habit.description && (
                <div className="relative overflow-hidden rounded-xl bg-muted/40 p-5 border border-border/50">
                <div className="flex gap-3">
                    <Quote className="h-5 w-5 opacity-40 shrink-0 text-primary mt-0.5" />
                    <SheetDescription className="text-base text-foreground/80 leading-relaxed font-medium whitespace-pre-wrap italic">
                        {habit.description}
                    </SheetDescription>
                </div>
                </div>
            )}
            {isEditing && (
                 <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-muted-foreground">Description</label>
                    <Textarea 
                        value={editForm.description}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        className="min-h-[100px] bg-background"
                        placeholder="Pourquoi ce rituel est important ?"
                    />
                 </div>
            )}

            {/* CALENDRIER */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Historique des Streaks</h4>
                </div>
                <div className="flex justify-center bg-muted/20 rounded-xl p-4 border">
                    <Calendar
                        mode="single"
                        selected={new Date()}
                        locale={fr}
                        modifiers={{ completed: (date) => completedDates.some(cd => isSameDay(date, cd)) }}
                        modifiersClassNames={{ completed: "border-2 border-red-500 text-red-600 font-bold bg-red-50 relative" }}
                        components={{
                            Day: ({ day, ...props }: any) => {
                                const date = day.date; 
                                const isCompleted = completedDates.some(cd => isSameDay(date, cd));
                                const isToday = isSameDay(date, new Date());
                                return (
                                    <div className="relative w-full h-full flex items-center justify-center p-1">
                                        <button {...props} className={cn("h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex items-center justify-center rounded-md transition-all", isCompleted ? "border-2 border-red-500 bg-red-50 text-red-700 font-bold" : "hover:bg-muted", isToday && !isCompleted && "border border-primary text-primary")} type="button">
                                            <span>{date.getDate()}</span>
                                        </button>
                                        {isCompleted && <Flame className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 text-orange-500 fill-orange-500 animate-in zoom-in duration-300 drop-shadow-sm" />}
                                    </div>
                                );
                            }
                        }}
                        className="rounded-md border bg-background shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Checklist</h4>
                    <Badge variant="secondary" className="text-[10px] h-5">{habit.steps?.length || 0}</Badge>
                </div>
                <div className="space-y-3">
                    {habit.steps?.map((step) => (
                        <div 
                          key={step.id} 
                          className={cn(
                            "group flex items-center justify-between p-3 rounded-lg border transition-all",
                            editingStepId === step.id ? "bg-background border-primary shadow-sm" : "bg-card/50 hover:bg-card"
                          )}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                {editingStepId !== step.id && (
                                    <Checkbox 
                                        checked={step.isCompleted} 
                                        onCheckedChange={() => handleToggleStep(step.id)} 
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
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={() => setEditingStepId(null)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div 
                                        className="flex items-center gap-2 flex-1 cursor-pointer group/item"
                                        onClick={() => {
                                            setEditingStepId(step.id);
                                            setTempStepTitle(step.title);
                                        }}
                                    >
                                        <span className={cn("text-sm font-medium flex-1", step.isCompleted && "line-through text-muted-foreground opacity-70")}>
                                            {step.title}
                                        </span>
                                        <Pencil className="h-3 w-3 mr-2 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                    </div>
                                )}
                            </div>
                            
                            {editingStepId !== step.id && (
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-opacity" onClick={() => handleDeleteStep(step.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    ))}
                    
                    <div className="flex gap-2 mt-4 pt-2 border-t border-dashed">
                        <Input value={newStepTitle} onChange={(e) => setNewStepTitle(e.target.value)} placeholder="Nouvelle étape..." className="h-9" onKeyDown={(e) => e.key === 'Enter' && handleAddStep()} />
                        <Button size="sm" onClick={handleAddStep} disabled={!newStepTitle || isAddingStep}>
                            {isAddingStep ? <Loader2 className="h-4 w-4 animate-spin"/> : <Plus className="h-4 w-4"/>}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                <CalendarIcon className="h-3 w-3" />
                Initié le {format(new Date(habit.createdAt), "d MMMM yyyy", { locale: fr })}
            </div>
         </div>
        </ScrollArea>

        {!isEditing && (
            <SheetFooter className="p-4 border-t bg-background/95 backdrop-blur flex flex-col gap-3">
                <Button 
                    className={cn(
                        "w-full h-12 text-base font-semibold shadow-md transition-all",
                        isDone ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-primary hover:bg-primary/90"
                    )}
                    onClick={handleToggleHabit}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 
                     isDone ? <><RotateCcw className="mr-2 h-5 w-5" /> Annuler validation</> : 
                     <><CheckCircle2 className="mr-2 h-5 w-5" /> Valider pour aujourd'hui</>
                    }
                </Button>
            </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}