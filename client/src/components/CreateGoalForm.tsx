import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
// 👇 IMPORT DES ICONES LUCIDE
import { 
  CalendarIcon, Loader2, 
  Dumbbell, Wallet, GraduationCap, Heart, Briefcase, Layers, // Pour les Catégories
  ArrowDown, Minus, ArrowUp // Pour les Priorités
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
import { cn } from "@/lib/utils";
import { GoalService } from "@/services/api";

const formSchema = z.object({
  title: z.string().min(2, "Le titre doit faire au moins 2 caractères."),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  startDate: z.date().min(new Date("1900-01-01"), "Une date de début est requise."),
  deadline: z.date().optional(),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "MEDIUM",
      startDate: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await GoalService.create({
        ...values,
        startDate: values.startDate.toISOString(),
        deadline: values.deadline?.toISOString(),
      });
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Erreur création", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* --- TITRE --- */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de l'objectif</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Apprendre le Japonais..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- DESCRIPTION --- */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Détaillez votre objectif..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* --- LIGNE : CATÉGORIE + PRIORITÉ --- */}
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
                      <SelectItem value="Sport">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4 text-blue-500" />
                          <span>Sport</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Finance">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-green-600" />
                          <span>Finance</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Education">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-purple-500" />
                          <span>Éducation</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Santé">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>Santé</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Carrière">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-amber-600" />
                          <span>Carrière</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Autre">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-slate-500" />
                          <span>Autre</span>
                        </div>
                      </SelectItem>
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
                      <SelectItem value="LOW">
                        <div className="flex items-center gap-2">
                          <ArrowDown className="h-4 w-4 text-green-500" />
                          <span>Basse</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="MEDIUM">
                        <div className="flex items-center gap-2">
                          <Minus className="h-4 w-4 text-orange-500" />
                          <span>Moyenne</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="HIGH">
                        <div className="flex items-center gap-2">
                          <ArrowUp className="h-4 w-4 text-red-500" />
                          <span>Haute</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        {/* --- LIGNE : DATES --- */}
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

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer l'objectif"}
        </Button>
      </form>
    </Form>
  );
}