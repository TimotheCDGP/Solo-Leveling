"use client"

import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

export function ChartPieInteractive({ data }: { data: { name: string, value: number }[] }) {
  const id = "pie-categories"
  
  const chartConfig = data.reduce((acc, curr, i) => {
    acc[curr.name] = { label: curr.name, color: `hsl(var(--chart-${(i % 5) + 1}))` }
    return acc
  }, {} as ChartConfig)

  return (
    <Card data-chart={id} className="flex flex-col border-none shadow-none bg-background/50">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="items-start pb-0">
        <CardTitle className="text-sm font-medium uppercase tracking-wider">Répartition Catégories</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}