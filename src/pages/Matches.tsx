import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

const mockMatches = [
  {
    id: 1,
    date: "2024-01-30",
    homeTeam: "Arsenal",
    awayTeam: "Liverpool",
    result: "2-1",
    status: "finished"
  },
  {
    id: 2,
    date: "2024-01-31",
    homeTeam: "Real Madrid", 
    awayTeam: "Barcelona",
    result: null,
    status: "upcoming"
  },
  {
    id: 3,
    date: "2024-01-29",
    homeTeam: "Manchester City",
    awayTeam: "Chelsea", 
    result: "3-0",
    status: "evaluated"
  },
  {
    id: 4,
    date: "2024-02-01",
    homeTeam: "PSG",
    awayTeam: "Bayern Munich",
    result: null,
    status: "upcoming"
  },
  {
    id: 5,
    date: "2024-01-28",
    homeTeam: "Juventus",
    awayTeam: "AC Milan",
    result: "1-2", 
    status: "finished"
  }
]

export default function Matches() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants = {
      upcoming: "bg-warning/10 text-warning border-warning/20",
      finished: "bg-info/10 text-info border-info/20",
      evaluated: "bg-success/10 text-success border-success/20"
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

  const filteredMatches = mockMatches.filter(match => {
    const matchesSearch = match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || match.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground mt-2">
            Manage past and upcoming football matches
          </p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Match
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Match</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Home Team</label>
                  <Input placeholder="Enter home team" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Away Team</label>
                  <Input placeholder="Enter away team" className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Match Date</label>
                <Input type="date" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                    <SelectItem value="evaluated">Evaluated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Create Match
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="evaluated">Evaluated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Matches Table */}
      <Card className="bg-gradient-card border-0">
        <CardHeader>
          <CardTitle>All Matches</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Home Team</TableHead>
                  <TableHead className="font-semibold">Away Team</TableHead>
                  <TableHead className="font-semibold">Result</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.map((match) => (
                  <TableRow 
                    key={match.id}
                    className="hover:bg-accent/50 transition-colors border-border/50"
                  >
                    <TableCell className="font-medium">#{match.id}</TableCell>
                    <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{match.homeTeam}</TableCell>
                    <TableCell className="font-medium">{match.awayTeam}</TableCell>
                    <TableCell>{match.result || "TBD"}</TableCell>
                    <TableCell>{getStatusBadge(match.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
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