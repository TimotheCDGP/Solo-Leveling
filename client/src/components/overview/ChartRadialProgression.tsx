"use client"

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

interface ChartRadialProps {
  xp: number;
  rank: string;
}

const chartConfig = {
  value: { label: "XP", color: "hsl(var(--chart-1))" }
} satisfies ChartConfig

export function ChartRadialProgression({ xp, rank }: ChartRadialProps) {
  const chartData = [{ name: "progress", value: xp, fill: "hsl(var(--chart-1))" }]

  return (
    <Card className="flex flex-col border-none shadow-none bg-background/50">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm font-medium uppercase tracking-wider">Progression</CardTitle>
        <CardDescription>{rank}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart 
            data={chartData} 
            endAngle={(xp / 6000) * 360} 
            innerRadius={80} 
            outerRadius={140}
          >
            <PolarGrid 
              gridType="circle" 
              radialLines={false} 
              stroke="none" 
              className="first:fill-muted last:fill-background" 
              polarRadius={[86, 74]} 
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">{xp}</tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-[10px] font-bold uppercase tracking-widest">Total XP</tspan>
                    </text>
                  )
                }
              }} />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}