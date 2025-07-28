import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  gradient?: "primary" | "success" | "warning" | "info"
  delay?: number
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = "neutral",
  gradient = "primary",
  delay = 0
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimating(true)
      const duration = 1000
      const steps = 60
      const increment = numericValue / steps
      let current = 0
      
      const interval = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          setDisplayValue(numericValue)
          clearInterval(interval)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [numericValue, delay])

  const gradientClass = {
    primary: "bg-gradient-primary shadow-glow-primary",
    success: "bg-gradient-to-r from-success to-success/80 shadow-glow-accent", 
    warning: "bg-gradient-to-r from-warning to-warning/80",
    info: "bg-gradient-to-r from-info to-info/80 shadow-glow-accent"
  }[gradient]

  const trendColor = {
    up: "text-success neon-primary",
    down: "text-destructive", 
    neutral: "text-muted-foreground"
  }[trend]

  return (
    <Card className="relative overflow-hidden group hover-glow glass-card border-primary/10 hover:border-primary/30 transition-all duration-500">
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">{title}</p>
            <div className="flex items-baseline gap-3">
              <h3 className={cn(
                "text-4xl font-bold tracking-tight transition-all duration-500",
                isAnimating && "animate-count-up neon-primary"
              )}>
                {typeof value === 'string' && value.includes('%') 
                  ? `${displayValue}%`
                  : typeof value === 'string' && value.includes('$')
                  ? `$${displayValue.toLocaleString()}`
                  : typeof value === 'string' && isNaN(numericValue)
                  ? value
                  : displayValue.toLocaleString()
                }
              </h3>
              {change && (
                <span className={cn("text-sm font-bold tracking-wide", trendColor)}>
                  {change}
                </span>
              )}
            </div>
          </div>
          
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
            gradientClass
          )}>
            <Icon className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>
        
        {/* Animated background shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
          <div className="w-full h-full bg-gradient-primary shimmer" />
        </div>
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-primary/30 transition-all duration-500" />
      </CardContent>
    </Card>
  )
}