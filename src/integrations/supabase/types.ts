export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      matches: {
        Row: {
          away_goals: number | null
          away_team_id: string
          created_at: string
          home_goals: number | null
          home_team_id: string
          id: string
          match_date: string
          season: string
          status: string
          updated_at: string
          winner: string | null
        }
        Insert: {
          away_goals?: number | null
          away_team_id: string
          created_at?: string
          home_goals?: number | null
          home_team_id: string
          id?: string
          match_date: string
          season?: string
          status?: string
          updated_at?: string
          winner?: string | null
        }
        Update: {
          away_goals?: number | null
          away_team_id?: string
          created_at?: string
          home_goals?: number | null
          home_team_id?: string
          id?: string
          match_date?: string
          season?: string
          status?: string
          updated_at?: string
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          accuracy: number | null
          algorithm: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          parameters: Json | null
          trained_at: string | null
          updated_at: string
          version: string
        }
        Insert: {
          accuracy?: number | null
          algorithm: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          parameters?: Json | null
          trained_at?: string | null
          updated_at?: string
          version: string
        }
        Update: {
          accuracy?: number | null
          algorithm?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          parameters?: Json | null
          trained_at?: string | null
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          away_expected_goals: number | null
          confidence_score: number
          created_at: string
          home_expected_goals: number | null
          id: string
          match_id: string
          model_name: string
          predicted_winner: string | null
          result_status: string | null
        }
        Insert: {
          away_expected_goals?: number | null
          confidence_score: number
          created_at?: string
          home_expected_goals?: number | null
          id?: string
          match_id: string
          model_name: string
          predicted_winner?: string | null
          result_status?: string | null
        }
        Update: {
          away_expected_goals?: number | null
          confidence_score?: number
          created_at?: string
          home_expected_goals?: number | null
          id?: string
          match_id?: string
          model_name?: string
          predicted_winner?: string | null
          result_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          founded: number | null
          id: string
          logo_url: string | null
          name: string
          short_code: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          founded?: number | null
          id?: string
          logo_url?: string | null
          name: string
          short_code: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          founded?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          short_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_logs: {
        Row: {
          accuracy_achieved: number | null
          completed_at: string | null
          created_at: string
          duration: number | null
          error_message: string | null
          id: string
          model_id: string
          started_at: string
          status: string
        }
        Insert: {
          accuracy_achieved?: number | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          error_message?: string | null
          id?: string
          model_id: string
          started_at?: string
          status?: string
        }
        Update: {
          accuracy_achieved?: number | null
          completed_at?: string | null
          created_at?: string
          duration?: number | null
          error_message?: string | null
          id?: string
          model_id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_logs_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
