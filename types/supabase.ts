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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      CourseSubmissions: {
        Row: {
          adresse: string | null
          annet: string | null
          antall_deltakere: number | null
          created_at: string | null
          dato_type: string | null
          datoer: string | null
          deltakermasse: string | null
          engelsk_kurs: boolean | null
          fra_dato: string | null
          id: number
          kontaktperson_epost: string | null
          kontaktperson_navn: string | null
          kontaktperson_telefon: string | null
          kurs_type: string | null
          kurs_type_annet: string | null
          kursbevis: boolean | null
          spesifikk_dato: string | null
          spesifikk_tid: string | null
          sted: string | null
          til_dato: string | null
        }
        Insert: {
          adresse?: string | null
          annet?: string | null
          antall_deltakere?: number | null
          created_at?: string | null
          dato_type?: string | null
          datoer?: string | null
          deltakermasse?: string | null
          engelsk_kurs?: boolean | null
          fra_dato?: string | null
          id?: number
          kontaktperson_epost?: string | null
          kontaktperson_navn?: string | null
          kontaktperson_telefon?: string | null
          kurs_type?: string | null
          kurs_type_annet?: string | null
          kursbevis?: boolean | null
          spesifikk_dato?: string | null
          spesifikk_tid?: string | null
          sted?: string | null
          til_dato?: string | null
        }
        Update: {
          adresse?: string | null
          annet?: string | null
          antall_deltakere?: number | null
          created_at?: string | null
          dato_type?: string | null
          datoer?: string | null
          deltakermasse?: string | null
          engelsk_kurs?: boolean | null
          fra_dato?: string | null
          id?: number
          kontaktperson_epost?: string | null
          kontaktperson_navn?: string | null
          kontaktperson_telefon?: string | null
          kurs_type?: string | null
          kurs_type_annet?: string | null
          kursbevis?: boolean | null
          spesifikk_dato?: string | null
          spesifikk_tid?: string | null
          sted?: string | null
          til_dato?: string | null
        }
        Relationships: []
      }
      EventParticipants: {
        Row: {
          allergies: string | null
          attended: boolean | null
          created_at: string
          email: string | null
          eventId: number | null
          id: number
          kull: number | null
          name: string | null
          status: string
        }
        Insert: {
          allergies?: string | null
          attended?: boolean | null
          created_at?: string
          email?: string | null
          eventId?: number | null
          id?: number
          kull?: number | null
          name?: string | null
          status?: string
        }
        Update: {
          allergies?: string | null
          attended?: boolean | null
          created_at?: string
          email?: string | null
          eventId?: number | null
          id?: number
          kull?: number | null
          name?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventParticipants_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
        ]
      }
      Events: {
        Row: {
          author: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          end_datetime: string | null
          id: number
          image: string | null
          location: string | null
          max_attendees: number | null
          reg_deadline: string | null
          reg_opens: string | null
          slug: string | null
          start_datetime: string | null
          title: string | null
        }
        Insert: {
          author?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          id?: number
          image?: string | null
          location?: string | null
          max_attendees?: number | null
          reg_deadline?: string | null
          reg_opens?: string | null
          slug?: string | null
          start_datetime?: string | null
          title?: string | null
        }
        Update: {
          author?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          end_datetime?: string | null
          id?: number
          image?: string | null
          location?: string | null
          max_attendees?: number | null
          reg_deadline?: string | null
          reg_opens?: string | null
          slug?: string | null
          start_datetime?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Events_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          approved: boolean | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
