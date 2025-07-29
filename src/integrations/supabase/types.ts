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
      applications: {
        Row: {
          applicant_id: string | null
          cover_letter: string | null
          created_at: string | null
          feedback: string | null
          id: string
          project_id: string | null
          status: string | null
        }
        Insert: {
          applicant_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
        }
        Update: {
          applicant_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          project_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_questions: {
        Row: {
          answer: string | null
          answered_at: string | null
          applicant_id: string
          created_at: string
          id: string
          project_id: string
          question: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          applicant_id: string
          created_at?: string
          id?: string
          project_id: string
          question: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          applicant_id?: string
          created_at?: string
          id?: string
          project_id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_questions_project_id"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          created_at: string | null
          description: string
          id: string
          owner_id: string | null
          people_count: number | null
          status: string | null
          title: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          description: string
          id?: string
          owner_id?: string | null
          people_count?: number | null
          status?: string | null
          title: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          created_at?: string | null
          description?: string
          id?: string
          owner_id?: string | null
          people_count?: number | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      wallet_connections: {
        Row: {
          connected_at: string | null
          connection_count: number | null
          created_at: string | null
          id: string
          ip_address: string | null
          last_connected_at: string | null
          updated_at: string | null
          user_agent: string | null
          wallet_address: string
        }
        Insert: {
          connected_at?: string | null
          connection_count?: number | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          last_connected_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          wallet_address: string
        }
        Update: {
          connected_at?: string | null
          connection_count?: number | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          last_connected_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      activities: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          kind: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      complete_project: {
        Args: { project_id_param: string }
        Returns: undefined
      }
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
