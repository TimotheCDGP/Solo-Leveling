"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Target,
  Flame,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react"

import { NavMain } from "@/components/dashboard/nav-main"
import { NavUser } from "@/components/dashboard/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const data = {
  navMain: [
    {
      title: "Vue d'ensemble",
      url: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Mes Objectifs",
      url: "/dashboard/goals",
      icon: Target,
    },
    {
      title: "Mes Habitudes",
      url: "/dashboard/habits",
      icon: Flame,
    },
    {
      title: "Boutique (Bientôt)",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Paramètres",
      url: "#",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      collapsible="icon" 
      className={cn("bg-background border-r border-border/50", className)} 
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="text-[--brand] fill-[--brand]/20 size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight italic font-oswald uppercase">
                  <span className="truncate font-black tracking-tighter text-lg">Hunter Leveling</span>
                  <span className="truncate text-[10px] font-bold opacity-70">System UI v1.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}