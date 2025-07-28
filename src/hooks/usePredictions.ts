import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Match } from './useMatches'

export interface Prediction {
  id: string
  match_id: string
  predicted_winner?: 'home' | 'away' | 'draw'
  home_expected_goals?: number
  away_expected_goals?: number
  confidence_score: number
  model_name: string
  created_at: string
  result_status: 'pending' | 'correct' | 'wrong'
  match?: Match
}

export const usePredictions = () => {
  return useQuery({
    queryKey: ['predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          match:matches(
            *,
            home_team:teams!home_team_id(*),
            away_team:teams!away_team_id(*)
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Prediction[]
    }
  })
}

export const useCreatePrediction = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (prediction: Omit<Prediction, 'id' | 'created_at' | 'match'>) => {
      const { data, error } = await supabase
        .from('predictions')
        .insert(prediction)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] })
      toast({
        title: "Prediction created",
        description: "New prediction has been generated successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create prediction.",
        variant: "destructive",
      })
    }
  })
}

export const useUpdatePrediction = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Prediction> & { id: string }) => {
      const { data, error } = await supabase
        .from('predictions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] })
      toast({
        title: "Prediction updated",
        description: "Prediction has been updated successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update prediction.",
        variant: "destructive",
      })
    }
  })
}