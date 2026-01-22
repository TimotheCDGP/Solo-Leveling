import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trophy, Target, Zap, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";

const profileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = React.useState<any>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "" },
  });

  React.useEffect(() => {
    fetch("/api/users/me/profile")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      await updateUser(values);
      toast.success("Licence mise à jour, Hunter.");
    } catch (error) {
      toast.error("Échec de la synchronisation.");
    }
  };

  return (
    <div className="container max-w-4xl py-10 space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold tracking-tight">Profil du Hunter</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* HUNTER LICENSE */}
        <Card className="md:col-span-2 overflow-hidden border-2 border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="flex justify-between items-center text-sm uppercase tracking-[0.2em] opacity-70">
              Hunter Association License
              <Badge variant="outline" className="font-mono">ID-{user?.id?.slice(0, 8)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-4xl">{user?.name?.[0]}</AvatarFallback>
            </Avatar>

            <div className="space-y-4 text-center sm:text-left flex-1">
              <div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">{user?.name}</h3>
                  <Badge 
                    className="text-lg px-3 italic font-black" 
                    style={{ backgroundColor: stats?.rankColor }}
                  >
                    Rang {stats?.rank}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Éveillé depuis le {stats && format(new Date(stats.createdAt), "dd MMMM yyyy", { locale: fr })}</span>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 pt-4">
                <Input {...form.register("name")} className="max-w-[200px]" placeholder="Nouveau nom..." />
                <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>Modifier</Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* MINI STATS GRID */}
        <div className="grid grid-cols-1 gap-4">
          <StatCard title="XP Cumulée" value={stats?.totalXP} icon={<Zap className="text-yellow-500" />} />
          <StatCard title="Objectifs" value={stats?.totalGoals} icon={<Target className="text-blue-500" />} />
          <StatCard title="Succès" value={stats?.completedGoals} icon={<Trophy className="text-emerald-500" />} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: any, icon: React.ReactNode }) {
  return (
    <Card className="flex items-center p-4 gap-4 bg-muted/30">
      <div className="p-2 bg-background rounded-lg shadow-sm">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{title}</p>
        <p className="text-xl font-bold">{value ?? "0"}</p>
      </div>
    </Card>
  );
}