import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea"; 
import { 
  Trash2, Plus, Loader2, Pencil, Check, X 
} from "lucide-react";
import { StepsService } from "@/services/steps.service";
import type { Step } from "@/types/goal";
import { toast } from "sonner";

interface GoalStepsListProps {
  goalId: string;
  initialSteps: Step[];
  goalStatus?: string;
  onStepsChange: (updatedSteps: Step[]) => void;
}

export function GoalStepsList({ goalId, initialSteps, goalStatus, onStepsChange }: GoalStepsListProps) {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDesc, setNewStepDesc] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);
  
  const totalSteps = steps.length;
  const completedSteps = steps.filter((s) => s.is_completed).length;

  let progress = 0;
  if (goalStatus === 'DONE') {
    progress = 100;
  } else if (totalSteps > 0) {
    progress = Math.round((completedSteps / totalSteps) * 100);
  }


  const handleToggle = async (stepId: string, checked: boolean) => {
    const updatedSteps = steps.map((s) => (s.id === stepId ? { ...s, is_completed: checked } : s));
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);

    try {
      await StepsService.toggle(stepId);
    } catch (error) {
      setSteps(steps); 
      onStepsChange(steps);
      toast.error("Erreur de connexion");
    }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) return;

    setIsAdding(true);
    try {
      const newStep = await StepsService.create(goalId, { 
        title: newStepTitle,
        description: newStepDesc 
      });
      const updatedSteps = [...steps, newStep];
      setSteps(updatedSteps);
      onStepsChange(updatedSteps);

      setNewStepTitle("");
      setNewStepDesc("");
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (stepId: string) => {
    const originalSteps = [...steps];
    const updatedSteps = steps.filter((s) => s.id !== stepId);
    
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);

    try {
      await StepsService.delete(stepId);
    } catch (error) {
      setSteps(originalSteps);
      onStepsChange(originalSteps);
      toast.error("Impossible de supprimer");
    }
  };

  const startEditing = (step: Step) => {
    setEditingStepId(step.id);
    setEditTitle(step.title);
    setEditDesc(step.description || "");
  };

  const cancelEditing = () => {
    setEditingStepId(null);
    setEditTitle("");
    setEditDesc("");
  };

  const saveEdit = async (stepId: string) => {
    if (!editTitle.trim()) return;

    const originalSteps = [...steps];
    const updatedSteps = steps.map((s) => 
        s.id === stepId ? { ...s, title: editTitle, description: editDesc } : s
    );

    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
    setEditingStepId(null);

    try {
        await StepsService.update(stepId, { title: editTitle, description: editDesc });
        toast.success("Étape modifiée");
    } catch (error) {
        setSteps(originalSteps);
        onStepsChange(originalSteps);
        toast.error("Erreur lors de la modification");
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="space-y-2 bg-muted/20 p-3 rounded-lg border">
        <div className="flex justify-between text-xs font-semibold uppercase text-muted-foreground">
          <span>Accomplissement</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className={`h-2.5 ${progress === 100 ? "[&>div]:bg-green-500" : ""}`} />
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`group flex items-start justify-between p-3 rounded-md transition-colors border ${
                editingStepId === step.id 
                ? "bg-background border-primary/50 shadow-sm"
                : "hover:bg-accent/50 border-transparent hover:border-border/50"
            }`}
          >
            {editingStepId === step.id ? (
                <div className="flex flex-col gap-3 w-full animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-2">
                        <Input 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Titre de l'étape"
                            className="h-8 font-medium"
                            autoFocus
                        />
                        <Textarea 
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            placeholder="Description (optionnelle)"
                            className="h-8 text-xs text-muted-foreground"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                         <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={cancelEditing}>
                             <X className="h-4 w-4 text-muted-foreground" />
                         </Button>
                         <Button size="sm" className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700 text-white" onClick={() => saveEdit(step.id)}>
                             <Check className="h-4 w-4" />
                         </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-start space-x-3 w-full">
                    <Checkbox
                        id={step.id}
                        checked={step.is_completed}
                        onCheckedChange={(checked) => handleToggle(step.id, checked as boolean)}
                        onClick={(e) => e.stopPropagation()} 
                        className="mt-1"
                    />
                    
                    <div className="flex flex-col gap-0.5 flex-1 cursor-pointer" onClick={() => startEditing(step)}>
                        <label
                            htmlFor={step.id}
                            className={`text-sm select-none font-medium transition-all cursor-pointer ${
                            step.is_completed ? "line-through text-muted-foreground decoration-muted-foreground/50" : "text-foreground"
                            }`}
                        >
                            {step.title}
                        </label>
                        {step.description && (
                            <p className={`text-xs ${step.is_completed ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
                                {step.description}
                            </p>
                        )}
                    </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mt-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                startEditing(step);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(step.id);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </>
            )}
          </div>
        ))}

        {steps.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                Aucune étape définie.
            </div>
        )}
      </div>

      <form onSubmit={handleAddStep} className="flex flex-col gap-3 pt-4 border-t mt-4">
        <div className="flex gap-2">
            <Input
            placeholder="Nouvelle étape..."
            value={newStepTitle}
            onChange={(e) => setNewStepTitle(e.target.value)}
            className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isAdding || !newStepTitle}>
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
        </div>
        {newStepTitle && (
             <Textarea 
                placeholder="Description (optionnelle)" 
                value={newStepDesc}
                onChange={(e) => setNewStepDesc(e.target.value)}
                className="text-xs h-8 bg-muted/30"
             />
        )}
      </form>
    </div>
  );
}