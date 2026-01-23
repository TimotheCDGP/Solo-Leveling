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
  const getNextPalier = (currentXp: number) => {
    if (currentXp < 500) return { max: 500, nextLabel: "D" };
    if (currentXp < 1500) return { max: 1500, nextLabel: "C" };
    if (currentXp < 3000) return { max: 3000, nextLabel: "B" };
    if (currentXp < 5000) return { max: 5000, nextLabel: "A" };
    if (currentXp < 7500) return { max: 7500, nextLabel: "S" };
    return { max: currentXp, nextLabel: "MAX" }; 
  };

  const { max, nextLabel } = getNextPalier(xp);
  
  const chartData = [{ 
    name: "progress", 
    value: xp, 
    fill: "hsl(var(--chart-1))" 
  }]

  return (
    <Card className="flex flex-col border-none shadow-none bg-background/50">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm font-medium uppercase tracking-wider">Progression</CardTitle>
        <CardDescription className="font-bold italic font-oswald text-muted-foreground">
          Rang {rank} <span className="mx-2 text-primary">→</span> Rang {nextLabel}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart 
            data={chartData} 
            startAngle={90}
            endAngle={90 + (xp / max) * 360}
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
            <RadialBar 
              dataKey="value" 
              background={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
              cornerRadius={10} 
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label content={({ viewBox }) => {
                const v = viewBox as any;
                if (v && "cx" in v && "cy" in v) {
                  return (
                    <text x={v.cx} y={v.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={v.cx} y={v.cy} className="fill-foreground text-4xl font-bold font-oswald italic">
                        {xp}
                      </tspan>
                      <tspan x={v.cx} y={v.cy + 24} className="fill-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                        Total XP
                      </tspan>
                    </text>
                  )
                }
                return null;
              }} />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}