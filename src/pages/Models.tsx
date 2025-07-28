import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Brain, Play, Settings, TrendingUp, Calendar, Clock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from "@/lib/utils"

const mockAccuracyData = [
  { version: 'v1.0', accuracy: 72 },
  { version: 'v1.1', accuracy: 75 },
  { version: 'v1.2', accuracy: 78 },
  { version: 'v2.0', accuracy: 82 },
  { version: 'v2.1', accuracy: 87 },
]

const mockTrainingLogs = [
  {
    id: 1,
    date: "2024-01-28 14:30",
    model: "Random Forest v2.1",
    status: "completed",
    accuracy: 87,
    duration: "45 min"
  },
  {
    id: 2,
    date: "2024-01-25 09:15", 
    model: "Neural Network v1.3",
    status: "completed",
    accuracy: 84,
    duration: "2h 15min"
  },
  {
    id: 3,
    date: "2024-01-23 16:45",
    model: "Ensemble v1.0",
    status: "failed",
    accuracy: null,
    duration: "12 min"
  },
  {
    id: 4,
    date: "2024-01-20 11:20",
    model: "Random Forest v2.0",
    status: "completed", 
    accuracy: 82,
    duration: "38 min"
  }
]

export default function Models() {
  const [selectedModel, setSelectedModel] = useState("random-forest")
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)

  const handleRetrain = () => {
    setIsTraining(true)
    setTrainingProgress(0)
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-success/10 text-success border-success/20",
      failed: "bg-destructive/10 text-destructive border-destructive/20",
      training: "bg-warning/10 text-warning border-warning/20"
    }
    
    return (
      <Badge 
        variant="outline"
        className={cn("capitalize", variants[status as keyof typeof variants])}
      >
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Models</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your machine learning models
          </p>
        </div>
      </div>

      {/* Current Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gradient-card border-0 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Active Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Model Type</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random-forest">Random Forest</SelectItem>
                      <SelectItem value="neural-network">Neural Network</SelectItem>
                      <SelectItem value="ensemble">Ensemble</SelectItem>
                      <SelectItem value="logistic">Logistic Regression</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Version</label>
                  <div className="text-lg font-semibold">v2.1</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <div className="text-2xl font-bold text-success">87%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <div className="text-2xl font-bold">Jan 28</div>
                  <div className="text-sm text-muted-foreground">Last Trained</div>
                </div>
                <div className="text-center p-4 bg-accent/20 rounded-lg">
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-muted-foreground">Samples</div>
                </div>
              </div>

              {isTraining && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Training in progress...</span>
                    <span>{Math.round(trainingProgress)}%</span>
                  </div>
                  <Progress value={trainingProgress} className="h-2" />
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleRetrain}
                  disabled={isTraining}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isTraining ? 'Training...' : 'Retrain Model'}
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gradient-card border-0 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Training Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold">Ready to Train</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  All systems operational
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Data Quality</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">High</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Backup</span>
                  <span>2 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Next Auto-train</span>
                  <span>Tomorrow</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Model Performance Chart */}
      <Card className="bg-gradient-card border-0 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle>Model Accuracy Over Versions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="version" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[60, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value) => [`${value}%`, 'Accuracy']}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Training Logs */}
      <Card className="bg-gradient-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Training History
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {mockTrainingLogs.map((log, index) => (
              <div 
                key={log.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-all duration-200 animate-fade-in",
                  "hover:shadow-sm hover:bg-accent/5"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <div className="font-medium">{log.model}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {log.date}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {log.accuracy ? `${log.accuracy}% accuracy` : 'Failed'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Duration: {log.duration}
                    </div>
                  </div>
                  {getStatusBadge(log.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}