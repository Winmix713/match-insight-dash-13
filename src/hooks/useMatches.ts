import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Team } from './useTeams'

export interface Match {
  id: string
  home_team_id: string
  away_team_id: string
  match_date: string
  home_goals?: number
  away_goals?: number
  status: 'scheduled' | 'live' | 'finished' | 'postponed' | 'cancelled'
  winner?: 'home' | 'away' | 'draw'
  season: string
  created_at: string
  updated_at: string
  home_team?: Team
  away_team?: Team
}

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*)
        `)
        .order('match_date', { ascending: false })
      
      if (error) throw error
      return data as Match[]
    }
  })
}

export const useCreateMatch = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (match: Omit<Match, 'id' | 'created_at' | 'updated_at' | 'home_team' | 'away_team'>) => {
      const { data, error } = await supabase
        .from('matches')
        .insert(match)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      toast({
        title: "Match created",
        description: "New match has been scheduled successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create match.",
        variant: "destructive",
      })
    }
  })
}

export const useUpdateMatch = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Match> & { id: string }) => {
      const { data, error } = await supabase
        .from('matches')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      queryClient.invalidateQueries({ queryKey: ['predictions'] })
      toast({
        title: "Match updated",
        description: "Match has been updated successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update match.",
        variant: "destructive",
      })
    }
  })
}

export const useDeleteMatch = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      toast({
        title: "Match deleted",
        description: "Match has been deleted successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete match.",
        variant: "destructive",
      })
    }
  })
}