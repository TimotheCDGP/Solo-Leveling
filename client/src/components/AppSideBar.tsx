"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Target,
  Shield,
  Settings,
  Trophy,
  Sparkles,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Données de navigation
const data = {
  navMain: [
    {
      title: "Tableau de bord",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      title: "Mes Objectifs",
      url: "/dashboard",
      icon: Target,
    },
    {
      title: "Habitudes (Bientôt)",
      url: "#",
      icon: Shield,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Trophy className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Hunter App</span>
                  <span className="truncate text-xs">Level Up Your Life</span>
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