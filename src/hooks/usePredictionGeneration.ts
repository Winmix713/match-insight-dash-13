import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export const useGeneratePrediction = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (matchId: string) => {
      const { data, error } = await supabase.functions.invoke('generate-predictions', {
        body: { match_id: matchId }
      })

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] })
      toast({
        title: "Prediction Generated",
        description: data.message || "New prediction has been generated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate prediction.",
        variant: "destructive",
      })
    }
  })
}

export const useEvaluatePredictions = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('evaluate-predictions')
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['predictions'] })
      queryClient.invalidateQueries({ queryKey: ['models'] })
      queryClient.invalidateQueries({ queryKey: ['active-model'] })
      toast({
        title: "Predictions Evaluated",
        description: data.message || "Predictions have been evaluated successfully.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to evaluate predictions.",
        variant: "destructive",
      })
    }
  })
}