import { TrendingUp, Zap, Target, Flame, Infinity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  // Assure-toi que CardAction est bien défini dans ton dossier ui/card, 
  // sinon utilise une div avec className="absolute right-4 top-4"
} from "@/components/ui/card"
import type { DashboardStats } from "@/types/dashboard"

export function StatsCards({ kpis }: { kpis: DashboardStats }) {
  const cards = [
    {
      title: "Objectifs Actifs",
      value: kpis.activeGoals,
      trend: "+2",
      footerBold: "Progression constante",
      footerSub: "Objectifs en cours d'exécution",
      icon: <Target className="size-4" />,
      badgeIcon: <TrendingUp className="size-3" />,
    },
    {
      title: "Habitudes",
      value: kpis.totalHabits,
      trend: "Stable",
      footerBold: "Régularité maintenue",
      footerSub: "Rituels quotidiens actifs",
      icon: <Infinity className="size-4" />,
      badgeIcon: <TrendingUp className="size-3" />,
    },
    {
      title: "XP Totale",
      value: kpis.xp.toLocaleString(),
      trend: "+12.5%",
      footerBold: "Gain d'XP ce mois-ci",
      footerSub: "Niveau de puissance actuel",
      icon: <Zap className="size-4 text-yellow-500" />,
      badgeIcon: <TrendingUp className="size-3" />,
    },
    {
      title: "Meilleure Série",
      value: `${kpis.bestStreak}j`,
      trend: "Record",
      footerBold: "Performance historique",
      footerSub: "Votre plus long streak",
      icon: <Flame className="size-4 text-orange-500" />,
      badgeIcon: <TrendingUp className="size-3" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-sm md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i} className="@container/card border border-border/60">
          <CardHeader className="relative">
            <CardDescription className="flex items-center gap-2">
              {card.icon} {card.title}
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="gap-1 bg-background/50 backdrop-blur-sm">
                {card.badgeIcon} {card.trend}
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              {card.footerBold} <TrendingUp className="size-3 text-emerald-500" />
            </div>
            <div className="text-muted-foreground">{card.footerSub}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}