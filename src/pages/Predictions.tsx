import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle, XCircle, Clock, Download, Filter, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const mockPredictions = [
  {
    id: 1,
    matchId: "M001",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    predictedWinner: "Arsenal",
    confidence: 78,
    modelUsed: "Random Forest",
    actualResult: "Arsenal",
    outcome: "correct"
  },
  {
    id: 2,
    matchId: "M002", 
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    predictedWinner: "Real Madrid",
    confidence: 65,
    modelUsed: "Neural Network",
    actualResult: "Barcelona",
    outcome: "wrong"
  },
  {
    id: 3,
    matchId: "M003",
    homeTeam: "Manchester City", 
    awayTeam: "Chelsea",
    predictedWinner: "Manchester City",
    confidence: 82,
    modelUsed: "Random Forest",
    actualResult: null,
    outcome: "pending"
  },
  {
    id: 4,
    matchId: "M004",
    homeTeam: "PSG",
    awayTeam: "Bayern Munich",
    predictedWinner: "Bayern Munich",
    confidence: 71,
    modelUsed: "Ensemble", 
    actualResult: "Bayern Munich",
    outcome: "correct"
  },
  {
    id: 5,
    matchId: "M005",
    homeTeam: "Juventus",
    awayTeam: "AC Milan",
    predictedWinner: "Juventus",
    confidence: 59,
    modelUsed: "Logistic Regression",
    actualResult: "AC Milan",
    outcome: "wrong"
  }
]

export default function Predictions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [outcomeFilter, setOutcomeFilter] = useState("all")
  const [modelFilter, setModelFilter] = useState("all")
  const [confidenceRange, setConfidenceRange] = useState([0])

  const getOutcomeIcon = (outcome: string) => {
    switch(outcome) {
      case 'correct':
        return <CheckCircle className="w-5 h-5 text-success" />
      case 'wrong':
        return <XCircle className="w-5 h-5 text-destructive" />
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />
      default:
        return null
    }
  }

  const getOutcomeBadge = (outcome: string) => {
    const variants = {
      correct: "bg-success/10 text-success border-success/20",
      wrong: "bg-destructive/10 text-destructive border-destructive/20",
      pending: "bg-warning/10 text-warning border-warning/20"
    }
    
    return (
      <Badge 
        variant="outline"
        className={cn("capitalize", variants[outcome as keyof typeof variants])}
      >
        {outcome}
      </Badge>
    )
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-success"
    if (confidence >= 60) return "text-warning" 
    return "text-destructive"
  }

  const filteredPredictions = mockPredictions.filter(prediction => {
    const matchesSearch = prediction.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prediction.awayTeam.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOutcome = outcomeFilter === "all" || prediction.outcome === outcomeFilter
    const matchesModel = modelFilter === "all" || prediction.modelUsed === modelFilter
    const matchesConfidence = prediction.confidence >= confidenceRange[0]
    
    return matchesSearch && matchesOutcome && matchesModel && matchesConfidence
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Predictions</h1>
          <p className="text-muted-foreground mt-2">
            Review and analyze model predictions and their accuracy
          </p>
        </div>
        
        <Button className="bg-gradient-primary hover:opacity-90">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Teams</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Outcome</label>
              <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outcomes</SelectItem>
                  <SelectItem value="correct">Correct</SelectItem>
                  <SelectItem value="wrong">Wrong</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Model</label>
              <Select value={modelFilter} onValueChange={setModelFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="Random Forest">Random Forest</SelectItem>
                  <SelectItem value="Neural Network">Neural Network</SelectItem>
                  <SelectItem value="Ensemble">Ensemble</SelectItem>
                  <SelectItem value="Logistic Regression">Logistic Regression</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Min Confidence: {confidenceRange[0]}%
              </label>
              <Slider
                value={confidenceRange}
                onValueChange={setConfidenceRange}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictions Table */}
      <Card className="bg-gradient-card border-0">
        <CardHeader>
          <CardTitle>Prediction Results</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">Match ID</TableHead>
                  <TableHead className="font-semibold">Teams</TableHead>
                  <TableHead className="font-semibold">Predicted Winner</TableHead>
                  <TableHead className="font-semibold">Confidence</TableHead>
                  <TableHead className="font-semibold">Model</TableHead>
                  <TableHead className="font-semibold">Actual Result</TableHead>
                  <TableHead className="font-semibold">Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPredictions.map((prediction) => (
                  <TableRow 
                    key={prediction.id}
                    className="hover:bg-accent/50 transition-colors border-border/50"
                  >
                    <TableCell className="font-medium">{prediction.matchId}</TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {prediction.homeTeam} vs {prediction.awayTeam}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{prediction.predictedWinner}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-medium", getConfidenceColor(prediction.confidence))}>
                          {prediction.confidence}%
                        </span>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-300",
                              prediction.confidence >= 80 ? "bg-success" :
                              prediction.confidence >= 60 ? "bg-warning" : "bg-destructive"
                            )}
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{prediction.modelUsed}</Badge>
                    </TableCell>
                    <TableCell>
                      {prediction.actualResult || "TBD"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getOutcomeIcon(prediction.outcome)}
                        {getOutcomeBadge(prediction.outcome)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}