"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  desktop: { label: "Objectifs", color: "hsl(var(--chart-1))" },
  mobile: { label: "Habitudes", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig

export function ChartLineInteractive({ data }: { data: any[] }) {
  const [activeChart, setActiveChart] = React.useState<"desktop" | "mobile">("desktop")

  return (
    <Card className="border-none shadow-none bg-transparent w-full">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4">
          <CardTitle className="text-sm font-medium uppercase tracking-wider">Activité Récente</CardTitle>
          <CardDescription className="text-xs text-muted-foreground italic">7 derniers jours</CardDescription>
        </div>
        <div className="flex border-t sm:border-t-0">
          {["desktop", "mobile"].map((key) => {
            const chartKey = key as keyof typeof chartConfig;
            return (
              <button
                key={key}
                data-active={activeChart === key}
                onClick={() => setActiveChart(key as any)}
                className="flex flex-1 flex-col justify-center gap-1 px-6 py-2 text-left data-[active=true]:bg-muted/50 sm:border-l transition-colors"
              >
                <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">
                  {chartConfig[chartKey].label}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) => new Date(val).toLocaleDateString("fr-FR", { weekday: "short" })}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={activeChart === "desktop" ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                strokeWidth={4}
                dot={{ r: 4, fill: activeChart === "desktop" ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}