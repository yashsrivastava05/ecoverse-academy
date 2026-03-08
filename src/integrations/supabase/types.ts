export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      daily_points: {
        Row: {
          created_at: string
          date: string
          id: string
          points_earned: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          points_earned?: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: []
      }
      mission_submissions: {
        Row: {
          id: string
          location_coords: Json | null
          mission_id: string
          notes: string | null
          photo_url: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["mission_status"]
          submitted_at: string
          user_id: string
        }
        Insert: {
          id?: string
          location_coords?: Json | null
          mission_id: string
          notes?: string | null
          photo_url?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["mission_status"]
          submitted_at?: string
          user_id: string
        }
        Update: {
          id?: string
          location_coords?: Json | null
          mission_id?: string
          notes?: string | null
          photo_url?: string | null
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["mission_status"]
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_submissions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          category: Database["public"]["Enums"]["mission_category"]
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["mission_difficulty"]
          eco_points_reward: number
          icon: string
          id: string
          is_active: boolean
          requires_location: boolean
          requires_photo: boolean
          steps: string[] | null
          title: string
          xp_reward: number
        }
        Insert: {
          category: Database["public"]["Enums"]["mission_category"]
          created_at?: string
          description: string
          difficulty: Database["public"]["Enums"]["mission_difficulty"]
          eco_points_reward?: number
          icon?: string
          id?: string
          is_active?: boolean
          requires_location?: boolean
          requires_photo?: boolean
          steps?: string[] | null
          title: string
          xp_reward?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["mission_category"]
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["mission_difficulty"]
          eco_points_reward?: number
          icon?: string
          id?: string
          is_active?: boolean
          requires_location?: boolean
          requires_photo?: boolean
          steps?: string[] | null
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_read?: boolean
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_emoji: string
          created_at: string
          daily_goal: number
          eco_points: number
          full_name: string
          id: string
          interests: string[] | null
          last_active_date: string | null
          school_name: string | null
          streak_days: number
          updated_at: string
        }
        Insert: {
          avatar_emoji?: string
          created_at?: string
          daily_goal?: number
          eco_points?: number
          full_name?: string
          id: string
          interests?: string[] | null
          last_active_date?: string | null
          school_name?: string | null
          streak_days?: number
          updated_at?: string
        }
        Update: {
          avatar_emoji?: string
          created_at?: string
          daily_goal?: number
          eco_points?: number
          full_name?: string
          id?: string
          interests?: string[] | null
          last_active_date?: string | null
          school_name?: string | null
          streak_days?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_approve_pending_submissions: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          location_coords: Json | null
          mission_id: string
          notes: string | null
          photo_url: string | null
          reviewed_at: string | null
          status: Database["public"]["Enums"]["mission_status"]
          submitted_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "mission_submissions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      update_streak: {
        Args: { p_user_id: string }
        Returns: {
          avatar_emoji: string
          created_at: string
          daily_goal: number
          eco_points: number
          full_name: string
          id: string
          interests: string[] | null
          last_active_date: string | null
          school_name: string | null
          streak_days: number
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      mission_category:
        | "planting"
        | "waste"
        | "energy"
        | "water"
        | "transport"
        | "biodiversity"
        | "campus"
      mission_difficulty: "easy" | "medium" | "hard"
      mission_status:
        | "available"
        | "in_progress"
        | "pending"
        | "approved"
        | "rejected"
      notification_type: "mission" | "badge" | "streak" | "reward" | "level_up"
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
    Enums: {
      mission_category: [
        "planting",
        "waste",
        "energy",
        "water",
        "transport",
        "biodiversity",
        "campus",
      ],
      mission_difficulty: ["easy", "medium", "hard"],
      mission_status: [
        "available",
        "in_progress",
        "pending",
        "approved",
        "rejected",
      ],
      notification_type: ["mission", "badge", "streak", "reward", "level_up"],
    },
  },
} as const
