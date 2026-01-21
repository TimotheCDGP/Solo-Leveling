import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  CalendarIcon, Loader2, 
  Dumbbell, Wallet, GraduationCap, Heart, Briefcase, Layers, 
  ArrowDown, Minus, ArrowUp,
  ListChecks, Plus, Trash2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"; 
import { cn } from "@/lib/utils";
import { GoalService } from "@/services/goal.service";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, "Le titre doit faire au moins 2 caractères."),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  startDate: z.date().min(new Date("1900-01-01"), "Une date de début est requise."),
  deadline: z.date().optional(),
  steps: z.array(z.object({
    title: z.string().min(1, "Le titre de l'étape est requis"),
    description: z.string().optional()
  })).optional()
}).refine((data) => {
  if (data.deadline && data.startDate) {
    return data.deadline >= data.startDate;
  }
  return true;
}, {
  message: "La deadline doit être après la date de début.",
  path: ["deadline"],
});

interface CreateGoalFormProps {
  onSuccess: () => void;
}

export function CreateGoalForm({ onSuccess }: CreateGoalFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const [stepInput, setStepInput] = useState("");
  const [stepDescInput, setStepDescInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "MEDIUM",
      startDate: new Date(),
      steps: [] 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
  });

  const handleAddStep = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault(); 
    if (!stepInput.trim()) return;

    append({ title: stepInput, description: stepDescInput });
    setStepInput("");
    setStepDescInput("");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await GoalService.create({
        ...values,
        startDate: values.startDate.toISOString(),
        deadline: values.deadline?.toISOString(),
      });
      
      toast.success("Objectif créé avec succès !");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Erreur création", error);
      toast.error("Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'objectif <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Ex: Apprendre le Japonais..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sport"><div className="flex gap-2"><Dumbbell className="h-4 w-4 text-blue-500"/>Sport</div></SelectItem>
                      <SelectItem value="Finance"><div className="flex gap-2"><Wallet className="h-4 w-4 text-green-600"/>Finance</div></SelectItem>
                      <SelectItem value="Education"><div className="flex gap-2"><GraduationCap className="h-4 w-4 text-purple-500"/>Éducation</div></SelectItem>
                      <SelectItem value="Santé"><div className="flex gap-2"><Heart className="h-4 w-4 text-red-500"/>Santé</div></SelectItem>
                      <SelectItem value="Carrière"><div className="flex gap-2"><Briefcase className="h-4 w-4 text-amber-600"/>Carrière</div></SelectItem>
                      <SelectItem value="Autre"><div className="flex gap-2"><Layers className="h-4 w-4 text-slate-500"/>Autre</div></SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Priorité</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW"><div className="flex gap-2"><ArrowDown className="h-4 w-4 text-green-500"/>Basse</div></SelectItem>
                      <SelectItem value="MEDIUM"><div className="flex gap-2"><Minus className="h-4 w-4 text-orange-500"/>Moyenne</div></SelectItem>
                      <SelectItem value="HIGH"><div className="flex gap-2"><ArrowUp className="h-4 w-4 text-red-500"/>Haute</div></SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Détaillez votre objectif..." 
                  className="resize-none h-20" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de début</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "P", { locale: fr }) : <span>Choisir...</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Deadline (Optionnel)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "P", { locale: fr }) : <span>Choisir...</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3 pt-2 border-t mt-4">
            <div className="flex items-center justify-between">
                 <Label className="flex items-center gap-2 text-base font-semibold">
                    <ListChecks className="h-4 w-4" /> 
                    Plan d'action ({fields.length})
                 </Label>
            </div>

            {fields.length > 0 && (
                <div className="bg-muted/30 rounded-lg border p-2 space-y-2 max-h-[200px] overflow-y-auto">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start justify-between bg-background p-2 rounded shadow-sm border group">
                            <div className="flex gap-3 overflow-hidden">
                                <Badge variant="outline" className="mt-0.5 h-5 w-5 flex items-center justify-center p-0 shrink-0 text-[10px]">
                                    {index + 1}
                                </Badge>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium truncate">{field.title}</span>
                                    {field.description && <span className="text-xs text-muted-foreground truncate">{field.description}</span>}
                                </div>
                            </div>
                            <Button
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-2 p-3 border rounded-lg bg-muted/10 border-dashed border-muted-foreground/30">
                <div className="flex gap-2">
                    <Input 
                        placeholder="Titre de l'étape..." 
                        value={stepInput}
                        onChange={(e) => setStepInput(e.target.value)}
                        className="bg-background h-9"
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                e.preventDefault();
                                handleAddStep(e);
                            }
                        }}
                    />
                    <Button 
                        type="button" 
                        size="icon" 
                        className="shrink-0 h-9 w-9" 
                        onClick={handleAddStep} 
                        disabled={!stepInput}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                {stepInput && (
                    <Input 
                        placeholder="Description (optionnelle)" 
                        value={stepDescInput}
                        onChange={(e) => setStepDescInput(e.target.value)}
                        className="bg-background h-8 text-xs"
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                e.preventDefault();
                                handleAddStep(e);
                            }
                        }}
                    />
                )}
            </div>
        </div>

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer l'objectif"}
        </Button>
      </form>
    </Form>
  );
}