import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const mockPredictions = [
  {
    id: 1,
    date: "2024-01-28",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool", 
    prediction: "Arsenal",
    actual: "Arsenal",
    confidence: 78,
    status: "correct"
  },
  {
    id: 2,
    date: "2024-01-27",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    prediction: "Real Madrid", 
    actual: "Barcelona",
    confidence: 65,
    status: "wrong"
  },
  {
    id: 3,
    date: "2024-01-26", 
    homeTeam: "Manchester City",
    awayTeam: "Chelsea",
    prediction: "Manchester City",
    actual: null,
    confidence: 82,
    status: "pending"
  },
  {
    id: 4,
    date: "2024-01-25",
    homeTeam: "PSG",
    awayTeam: "Bayern Munich",
    prediction: "Bayern Munich",
    actual: "Bayern Munich", 
    confidence: 71,
    status: "correct"
  },
  {
    id: 5,
    date: "2024-01-24",
    homeTeam: "Juventus", 
    awayTeam: "AC Milan",
    prediction: "Juventus",
    actual: "AC Milan",
    confidence: 59,
    status: "wrong"
  }
]

export function RecentPredictions() {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'correct':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'wrong':
        return <XCircle className="w-4 h-4 text-destructive" />
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      correct: "bg-success/10 text-success border-success/20",
      wrong: "bg-destructive/10 text-destructive border-destructive/20", 
      pending: "bg-warning/10 text-warning border-warning/20"
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
    <Card className="bg-gradient-card border-0 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Predictions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {mockPredictions.map((prediction, index) => (
            <div 
              key={prediction.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-all duration-200 animate-fade-in",
                "hover:shadow-sm hover:bg-accent/5"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(prediction.status)}
                <div>
                  <div className="font-medium text-sm">
                    {prediction.homeTeam} vs {prediction.awayTeam}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(prediction.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    Predicted: {prediction.prediction}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Confidence: {prediction.confidence}%
                  </div>
                </div>
                {getStatusBadge(prediction.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}