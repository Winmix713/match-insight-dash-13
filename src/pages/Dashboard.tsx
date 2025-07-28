import { StatCard } from "@/components/dashboard/StatCard"
import { PredictionsChart } from "@/components/dashboard/PredictionsChart"
import { RecentPredictions } from "@/components/dashboard/RecentPredictions"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, Target, Brain, Zap } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
    
    toast({
      title: "Dashboard Refreshed",
      description: "All data has been updated successfully.",
    })
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold tracking-tight gradient-text-primary">Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Welcome back! Here's your sports prediction overview.
          </p>
        </div>
        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-gradient-primary hover:shadow-glow-primary hover-scale disabled:opacity-50 font-semibold px-6 py-3 text-base"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <StatCard
          title="Total Matches"
          value="1,247"
          change="+12%"
          icon={Target}
          trend="up"
          gradient="primary"
          delay={0}
        />
        <StatCard
          title="Prediction Accuracy"
          value="87%"
          change="+3.2%"
          icon={TrendingUp}
          trend="up"
          gradient="success"
          delay={200}
        />
        <StatCard
          title="Active Model"
          value="Random Forest v2.1"
          icon={Brain}
          gradient="info"
          delay={400}
        />
        <StatCard
          title="Confidence Threshold"
          value="75%"
          change="±0%"
          icon={Zap}
          trend="neutral"
          gradient="warning"
          delay={600}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionsChart />
        <RecentPredictions />
      </div>
    </div>
  )
}