import { useState } from "react"
import { 
  BarChart3, 
  Trophy, 
  Target, 
  Brain, 
  TrendingUp, 
  Settings,
  Menu,
  ChevronLeft
} from "lucide-react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navigation = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Matches", url: "/matches", icon: Trophy },
  { title: "Predictions", url: "/predictions", icon: Target },
  { title: "Models", url: "/models", icon: Brain },
  { title: "Statistics", url: "/statistics", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "w-full transition-all duration-300 hover:bg-sidebar-accent/50 group relative overflow-hidden",
      "before:absolute before:inset-0 before:bg-gradient-primary before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-10",
      isActive 
        ? "bg-gradient-primary text-primary-foreground shadow-glow-primary border-l-2 border-primary" 
        : "text-sidebar-foreground hover:text-primary"
    )

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border transition-all duration-300 glass-panel",
        collapsed ? "w-14" : "w-64"
      )}
      collapsible="icon"
    >
      <SidebarContent className="p-4 custom-scrollbar">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow-primary hover-scale">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold gradient-text-primary tracking-wide">SportsPred</h1>
                <p className="text-xs text-sidebar-foreground/60 font-medium">Analytics Dashboard</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 text-xs uppercase tracking-widest mb-4 font-semibold">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavClasses}>
                      <item.icon className={cn(
                        "h-5 w-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3", 
                        !collapsed && "mr-3"
                      )} />
                      {!collapsed && (
                        <span className="font-semibold tracking-wide">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <div className="mt-auto pt-8">
            <div className="glass-card rounded-2xl p-4 text-center hover-glow">
              <div className="w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-3 flex items-center justify-center shadow-glow-primary">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-sidebar-foreground mb-1">Upgrade to Pro</h3>
              <p className="text-xs text-sidebar-foreground/60 mb-3 leading-relaxed">
                Advanced analytics and unlimited predictions
              </p>
              <button className="w-full py-2 px-4 bg-gradient-primary text-primary-foreground font-semibold rounded-lg hover-scale transition-all duration-300">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}