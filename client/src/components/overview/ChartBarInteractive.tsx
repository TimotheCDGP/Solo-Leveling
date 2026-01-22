"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  value: { label: "Objectifs", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

export function ChartBarInteractive({ data }: { data: { name: string, value: number }[] }) {
  return (
    <Card className="border-none shadow-none bg-background/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium uppercase tracking-wider">Analyse Priorités</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} opacity={0.1} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} tickMargin={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--chart-3))" 
              radius={[4, 4, 0, 0]} 
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}