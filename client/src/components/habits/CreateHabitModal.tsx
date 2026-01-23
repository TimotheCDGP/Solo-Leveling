"use client"

import * as React from "react";
import { useState } from "react";
import { 
  Plus, Trash2, Flame, Loader2, 
  Heart, Zap, Leaf, Brain, LayoutGrid, ListChecks 
} from "lucide-react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { HabitService } from "@/services/habit.service";
import { toast } from "sonner";

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateHabitModal({ isOpen, onClose, onSuccess }: CreateHabitModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isLoading, setIsLoading] = useState(false);
  
  // États du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Santé");
  const [steps, setSteps] = useState<string[]>([]);
  const [stepInput, setStepInput] = useState("");

  const handleAddStep = (e: React.FormEvent | React.MouseEvent) => {
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

      toast.success("Nouveau rituel initialisé !");
      // Reset
      setTitle("");
      setDescription("");
      setSteps([]);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Échec de l'initialisation du système");
    } finally {
      setIsLoading(false);
    }
  };

  // Contenu du formulaire partagé entre Dialog et Drawer
  const FormContent = (
    <div className="grid gap-5 py-4 px-4 sm:px-0">
      <div className="grid gap-2">
        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nom du rituel <span className="text-red-500">*</span></Label>
        <Input 
          id="title"
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Ex: Méditation matinale..." 
          className="h-11 border-primary/20 focus-visible:ring-primary"
          autoFocus
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Objectif / Description</Label>
        <Textarea 
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Pourquoi cette habitude est cruciale ?"
          className="resize-none min-h-[80px] border-primary/20"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Catégorie</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-11 border-primary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Santé"><div className="flex items-center gap-2 text-red-600"><Heart className="h-4 w-4" /> <span>Santé</span></div></SelectItem>
            <SelectItem value="Productivité"><div className="flex items-center gap-2 text-amber-500"><Zap className="h-4 w-4" /> <span>Productivité</span></div></SelectItem>
            <SelectItem value="Bien-être"><div className="flex items-center gap-2 text-green-600"><Leaf className="h-4 w-4" /> <span>Bien-être</span></div></SelectItem>
            <SelectItem value="Apprentissage"><div className="flex items-center gap-2 text-purple-600"><Brain className="h-4 w-4" /> <span>Apprentissage</span></div></SelectItem>
            <SelectItem value="Autre"><div className="flex items-center gap-2 text-slate-500"><LayoutGrid className="h-4 w-4" /> <span>Autre</span></div></SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2 border-t border-primary/10">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> Sous-étapes
          </Label>
          <Badge variant="outline" className="text-[9px] uppercase tracking-tighter">Optionnel</Badge>
        </div>
        
        {steps.length > 0 && (
          <div className="flex flex-col gap-2 mb-2 max-h-[150px] overflow-y-auto pr-1">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between bg-muted/30 p-2 rounded-lg text-sm border border-border/50 animate-in fade-in slide-in-from-left-2">
                <span className="flex items-center gap-2 truncate">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {idx+1}
                  </span>
                  <span className="truncate">{step}</span>
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeStep(idx)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input 
            value={stepInput} 
            onChange={(e) => setStepInput(e.target.value)} 
            placeholder="Ex: Boire un verre d'eau..."
            className="h-10 border-dashed"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddStep(e);
              }
            }}
          />
          <Button type="button" size="icon" className="h-10 w-10 shrink-0 bg-secondary text-secondary-foreground" onClick={handleAddStep} disabled={!stepInput}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {!isDesktop && (
        <Button onClick={handleSubmit} className="w-full h-12 text-base font-bold uppercase tracking-widest" disabled={isLoading || !title}>
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : "Initialiser le rituel"}
        </Button>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-oswald uppercase italic font-black">
              <Flame className="text-orange-500 fill-orange-500 h-6 w-6" /> 
              Nouveau Rituel
            </DialogTitle>
            <DialogDescription>
              Définissez les paramètres de votre nouvelle habitude.
            </DialogDescription>
          </DialogHeader>
          
          {FormContent}

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Annuler</Button>
            <Button onClick={handleSubmit} className="px-8 font-bold uppercase tracking-widest" disabled={isLoading || !title}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Créer l'habitude"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2 text-xl font-oswald uppercase italic font-black">
            <Flame className="text-orange-500 fill-orange-500 h-5 w-5" /> 
            Nouveau Rituel
          </DrawerTitle>
          <DrawerDescription>
            Établissez votre discipline quotidienne.
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto max-h-[70vh]">
          {FormContent}
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}