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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      certification_attempts: {
        Row: {
          answers: Json | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          ip_address: unknown
          outcome: string
          reason_codes: string[]
          requested_kinds: string[]
          user_agent: string | null
        }
        Insert: {
          answers?: Json | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          ip_address?: unknown
          outcome?: string
          reason_codes?: string[]
          requested_kinds?: string[]
          user_agent?: string | null
        }
        Update: {
          answers?: Json | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          ip_address?: unknown
          outcome?: string
          reason_codes?: string[]
          requested_kinds?: string[]
          user_agent?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          contact_type: string[]
          created_at: string
          email: string
          full_name: string
          id: string
          marketing_opt_in: boolean
          marketing_opt_in_at: string | null
          phone: string | null
          privacy_notice_version: string | null
          updated_at: string
        }
        Insert: {
          contact_type?: string[]
          created_at?: string
          email: string
          full_name: string
          id?: string
          marketing_opt_in?: boolean
          marketing_opt_in_at?: string | null
          phone?: string | null
          privacy_notice_version?: string | null
          updated_at?: string
        }
        Update: {
          contact_type?: string[]
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          marketing_opt_in?: boolean
          marketing_opt_in_at?: string | null
          phone?: string | null
          privacy_notice_version?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_privacy_notice_version_fkey"
            columns: ["privacy_notice_version"]
            isOneToOne: false
            referencedRelation: "privacy_notice_versions"
            referencedColumns: ["version"]
          },
        ]
      }
      investor_statement_financials: {
        Row: {
          created_at: string
          income_band: number | null
          net_assets_band: number | null
          statement_id: string
        }
        Insert: {
          created_at?: string
          income_band?: number | null
          net_assets_band?: number | null
          statement_id: string
        }
        Update: {
          created_at?: string
          income_band?: number | null
          net_assets_band?: number | null
          statement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_statement_financials_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: true
            referencedRelation: "investor_statements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investor_statement_financials_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: true
            referencedRelation: "v_contact_certification"
            referencedColumns: ["statement_id"]
          },
        ]
      }
      investor_statements: {
        Row: {
          answers: Json
          contact_id: string
          created_at: string
          declarations: Json
          declared_full_name: string
          expires_at: string
          id: string
          instrument: string
          ip_address: unknown
          qualifying_criteria: string[]
          revoked_at: string | null
          revoked_reason: string | null
          signature_typed: string
          signed_at: string
          statement_kind: Database["public"]["Enums"]["statement_kind"]
          statement_snapshot: string
          statement_version: string
          user_agent: string | null
        }
        Insert: {
          answers: Json
          contact_id: string
          created_at?: string
          declarations: Json
          declared_full_name: string
          expires_at?: string
          id?: string
          instrument?: string
          ip_address?: unknown
          qualifying_criteria: string[]
          revoked_at?: string | null
          revoked_reason?: string | null
          signature_typed: string
          signed_at: string
          statement_kind: Database["public"]["Enums"]["statement_kind"]
          statement_snapshot: string
          statement_version: string
          user_agent?: string | null
        }
        Update: {
          answers?: Json
          contact_id?: string
          created_at?: string
          declarations?: Json
          declared_full_name?: string
          expires_at?: string
          id?: string
          instrument?: string
          ip_address?: unknown
          qualifying_criteria?: string[]
          revoked_at?: string | null
          revoked_reason?: string | null
          signature_typed?: string
          signed_at?: string
          statement_kind?: Database["public"]["Enums"]["statement_kind"]
          statement_snapshot?: string
          statement_version?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investor_statements_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investor_statements_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "v_contact_certification"
            referencedColumns: ["contact_id"]
          },
        ]
      }
      privacy_notice_versions: {
        Row: {
          body_hash: string
          created_at: string
          effective_from: string
          updated_at: string
          version: string
        }
        Insert: {
          body_hash: string
          created_at?: string
          effective_from?: string
          updated_at?: string
          version: string
        }
        Update: {
          body_hash?: string
          created_at?: string
          effective_from?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      promotion_communications: {
        Row: {
          channel: string
          contact_id: string
          document_id: string | null
          exemption_relied_on: string
          id: string
          ip_address: unknown
          sent_at: string
          statement_expires_at: string
          statement_id: string
          statement_signed_at: string
          token_id: string | null
          user_agent: string | null
        }
        Insert: {
          channel: string
          contact_id: string
          document_id?: string | null
          exemption_relied_on: string
          id?: string
          ip_address?: unknown
          sent_at?: string
          statement_expires_at: string
          statement_id: string
          statement_signed_at: string
          token_id?: string | null
          user_agent?: string | null
        }
        Update: {
          channel?: string
          contact_id?: string
          document_id?: string | null
          exemption_relied_on?: string
          id?: string
          ip_address?: unknown
          sent_at?: string
          statement_expires_at?: string
          statement_id?: string
          statement_signed_at?: string
          token_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_communications_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_communications_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "v_contact_certification"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "promotion_communications_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "investor_statements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_communications_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "v_contact_certification"
            referencedColumns: ["statement_id"]
          },
        ]
      }
    }
    Views: {
      v_contact_certification: {
        Row: {
          contact_id: string | null
          days_remaining: number | null
          due_for_recertification: boolean | null
          expires_at: string | null
          is_certified: boolean | null
          signed_at: string | null
          statement_id: string | null
          statement_kind: Database["public"]["Enums"]["statement_kind"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      fn_can_promote: {
        Args: { p_at?: string; p_contact_id: string }
        Returns: {
          allowed: boolean
          reason: string
          statement_id: string
        }[]
      }
    }
    Enums: {
      statement_kind: "hnw" | "scsi"
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
      statement_kind: ["hnw", "scsi"],
    },
  },
} as const
