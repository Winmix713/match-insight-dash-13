import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Model {
  id: string
  name: string
  version: string
  algorithm: string
  parameters: Record<string, any>
  trained_at?: string
  accuracy?: number
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export const useModels = () => {
  return useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Model[]
    }
  })
}

export const useActiveModel = () => {
  return useQuery({
    queryKey: ['active-model'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('is_active', true)
        .single()
      
      if (error) throw error
      return data as Model
    }
  })
}

export const useCreateModel = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (model: Omit<Model, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('models')
        .insert(model)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
      queryClient.invalidateQueries({ queryKey: ['active-model'] })
      toast({
        title: "Model created",
        description: "New model has been created successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create model.",
        variant: "destructive",
      })
    }
  })
}

export const useUpdateModel = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Model> & { id: string }) => {
      const { data, error } = await supabase
        .from('models')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
      queryClient.invalidateQueries({ queryKey: ['active-model'] })
      toast({
        title: "Model updated",
        description: "Model has been updated successfully.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update model.",
        variant: "destructive",
      })
    }
  })
}