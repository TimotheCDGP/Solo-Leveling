import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Trash2, Flame, Loader2, 
  Heart, Zap, Leaf, Brain, LayoutGrid 
} from "lucide-react";
import { HabitService } from "@/services/habit.service";
import { toast } from "sonner";

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateHabitModal({ isOpen, onClose, onSuccess }: CreateHabitModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Santé");
  const [steps, setSteps] = useState<string[]>([]);
  const [stepInput, setStepInput] = useState("");

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepInput.trim()) return;
    setSteps([...steps, stepInput]);
    setStepInput("");
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsLoading(true);

    try {
      await HabitService.create({
        title: title,
        name: title,
        description: description,
        frequency: "DAILY",
        category: category,
        steps: steps.map(t => ({ title: t }))
      });

      toast.success("Habitude créée !");
      setTitle("");
      setDescription("");
      setSteps([]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Flame className="text-orange-500 fill-orange-500" /> 
            Nouvelle Habitude
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-4">
            
            {/* TITRE */}
            <div className="grid gap-2">
                <Label htmlFor="title">Nom du rituel <span className="text-red-500">*</span></Label>
                <Input 
                    id="title"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Ex: Routine du matin..." 
                    autoFocus
                />
            </div>

            {/* DESCRIPTION (AJOUTÉ) */}
            <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                    id="desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Pourquoi cette habitude est importante ?"
                    className="resize-none"
                />
            </div>

            {/* CATÉGORIE AVEC ICÔNES */}
            <div className="grid gap-2">
                <Label>Catégorie</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Santé">
                            <div className="flex items-center gap-2 text-red-600">
                                <Heart className="h-4 w-4" /> <span>Santé</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="Productivité">
                            <div className="flex items-center gap-2 text-amber-500">
                                <Zap className="h-4 w-4" /> <span>Productivité</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="Bien-être">
                            <div className="flex items-center gap-2 text-green-600">
                                <Leaf className="h-4 w-4" /> <span>Bien-être</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="Apprentissage">
                            <div className="flex items-center gap-2 text-purple-600">
                                <Brain className="h-4 w-4" /> <span>Apprentissage</span>
                            </div>
                        </SelectItem>
                        <SelectItem value="Autre">
                            <div className="flex items-center gap-2 text-slate-500">
                                <LayoutGrid className="h-4 w-4" /> <span>Autre</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* STEPS */}
            <div className="space-y-3 pt-2 border-t">
                <div className="flex justify-between items-center">
                    <Label>Sous-étapes (Checklist)</Label>
                    <Badge variant="outline" className="text-[10px] font-normal">Optionnel</Badge>
                </div>
                
                {steps.length > 0 && (
                    <div className="flex flex-col gap-2 mb-2">
                        {steps.map((step, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-muted/40 p-2 rounded-md text-sm border animate-in fade-in slide-in-from-left-2">
                                <span className="flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full border bg-background text-[10px] text-muted-foreground">
                                        {idx+1}
                                    </span>
                                    {step}
                                </span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500" onClick={() => removeStep(idx)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <Input 
                        value={stepInput} 
                        onChange={(e) => setStepInput(e.target.value)} 
                        placeholder="Ajouter une étape..."
                        className="h-9"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddStep(e);
                            }
                        }}
                    />
                    <Button type="button" size="icon" className="h-9 w-9 shrink-0" onClick={handleAddStep} disabled={!stepInput}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

        <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !title}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Créer l'habitude
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}