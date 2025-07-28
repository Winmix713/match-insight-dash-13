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
import { useMatches, useCreateMatch, useUpdateMatch, useDeleteMatch } from "@/hooks/useMatches"
import { useTeams } from "@/hooks/useTeams"
import { format } from "date-fns"

export default function Matches() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newMatchData, setNewMatchData] = useState({
    home_team_id: "",
    away_team_id: "",
    match_date: "",
    status: "scheduled" as const
  })

  const { data: matches = [], isLoading: matchesLoading } = useMatches()
  const { data: teams = [] } = useTeams()
  const createMatchMutation = useCreateMatch()
  const updateMatchMutation = useUpdateMatch()
  const deleteMatchMutation = useDeleteMatch()

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "bg-warning/10 text-warning border-warning/20",
      live: "bg-destructive/10 text-destructive border-destructive/20",
      finished: "bg-info/10 text-info border-info/20",
      postponed: "bg-muted/10 text-muted-foreground border-muted/20",
      cancelled: "bg-muted/10 text-muted-foreground border-muted/20"
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

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.home_team?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.away_team?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || match.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreateMatch = async () => {
    if (!newMatchData.home_team_id || !newMatchData.away_team_id || !newMatchData.match_date) {
      return
    }

    await createMatchMutation.mutateAsync({
      ...newMatchData,
      season: "2024/25"
    })

    setNewMatchData({
      home_team_id: "",
      away_team_id: "",
      match_date: "",
      status: "scheduled"
    })
    setIsAddModalOpen(false)
  }

  const handleDeleteMatch = async (id: string) => {
    await deleteMatchMutation.mutateAsync(id)
  }

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
                  <Select value={newMatchData.home_team_id} onValueChange={(value) => setNewMatchData(prev => ({ ...prev, home_team_id: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select home team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Away Team</label>
                  <Select value={newMatchData.away_team_id} onValueChange={(value) => setNewMatchData(prev => ({ ...prev, away_team_id: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select away team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Match Date</label>
                <Input 
                  type="datetime-local" 
                  className="mt-1" 
                  value={newMatchData.match_date}
                  onChange={(e) => setNewMatchData(prev => ({ ...prev, match_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={newMatchData.status} onValueChange={(value: any) => setNewMatchData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                  onClick={handleCreateMatch}
                  disabled={createMatchMutation.isPending}
                >
                  {createMatchMutation.isPending ? "Creating..." : "Create Match"}
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
                {matchesLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading matches...
                    </TableCell>
                  </TableRow>
                ) : filteredMatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No matches found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMatches.map((match) => (
                    <TableRow 
                      key={match.id}
                      className="hover:bg-accent/50 transition-colors border-border/50"
                    >
                      <TableCell className="font-medium">#{match.id.slice(0, 8)}</TableCell>
                      <TableCell>{format(new Date(match.match_date), 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell className="font-medium">{match.home_team?.name}</TableCell>
                      <TableCell className="font-medium">{match.away_team?.name}</TableCell>
                      <TableCell>
                        {match.home_goals !== null && match.away_goals !== null 
                          ? `${match.home_goals}-${match.away_goals}` 
                          : "TBD"
                        }
                      </TableCell>
                      <TableCell>{getStatusBadge(match.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteMatch(match.id)}
                            disabled={deleteMatchMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}