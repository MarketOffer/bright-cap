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
      access_attempts: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          kind: string
          reason_code: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown
          kind: string
          reason_code: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          kind?: string
          reason_code?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      access_tokens: {
        Row: {
          claim_hash: string | null
          claimed_at: string | null
          claimed_ip: unknown
          claimed_user_agent: string | null
          contact_id: string
          created_at: string
          document_id: string
          expires_at: string
          first_used_at: string | null
          id: string
          last_used_at: string | null
          revoked_at: string | null
          revoked_reason: string | null
          statement_id: string
          token_hash: string
          use_count: number
        }
        Insert: {
          claim_hash?: string | null
          claimed_at?: string | null
          claimed_ip?: unknown
          claimed_user_agent?: string | null
          contact_id: string
          created_at?: string
          document_id: string
          expires_at: string
          first_used_at?: string | null
          id?: string
          last_used_at?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          statement_id: string
          token_hash: string
          use_count?: number
        }
        Update: {
          claim_hash?: string | null
          claimed_at?: string | null
          claimed_ip?: unknown
          claimed_user_agent?: string | null
          contact_id?: string
          created_at?: string
          document_id?: string
          expires_at?: string
          first_used_at?: string | null
          id?: string
          last_used_at?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          statement_id?: string
          token_hash?: string
          use_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "access_tokens_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_tokens_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "v_contact_certification"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "access_tokens_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_tokens_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "investor_statements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_tokens_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "v_contact_certification"
            referencedColumns: ["statement_id"]
          },
        ]
      }
      admin_access_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_user_id: string
          created_at: string
          detail: Json
          id: string
          ip_address: unknown
          subject_id: string | null
          subject_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_user_id: string
          created_at?: string
          detail?: Json
          id?: string
          ip_address?: unknown
          subject_id?: string | null
          subject_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_user_id?: string
          created_at?: string
          detail?: Json
          id?: string
          ip_address?: unknown
          subject_id?: string | null
          subject_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      certification_attempts: {
        Row: {
          answers: Json | null
          attempt_group_id: string | null
          created_at: string
          declined_kind: Database["public"]["Enums"]["statement_kind"] | null
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
          attempt_group_id?: string | null
          created_at?: string
          declined_kind?: Database["public"]["Enums"]["statement_kind"] | null
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
          attempt_group_id?: string | null
          created_at?: string
          declined_kind?: Database["public"]["Enums"]["statement_kind"] | null
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
      documents: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          promoter_company_number: string
          promoter_entity_name: string
          slug: string
          storage_path: string
          title: string
          updated_at: string
          version: string
          warning_block_version: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          promoter_company_number: string
          promoter_entity_name: string
          slug: string
          storage_path: string
          title: string
          updated_at?: string
          version: string
          warning_block_version: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          promoter_company_number?: string
          promoter_entity_name?: string
          slug?: string
          storage_path?: string
          title?: string
          updated_at?: string
          version?: string
          warning_block_version?: string
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          description: string | null
          enabled: boolean
          key: string
          updated_at: string
        }
        Insert: {
          description?: string | null
          enabled?: boolean
          key: string
          updated_at?: string
        }
        Update: {
          description?: string | null
          enabled?: boolean
          key?: string
          updated_at?: string
        }
        Relationships: []
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
          attempt_group_id: string | null
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
          attempt_group_id?: string | null
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
          attempt_group_id?: string | null
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
          dispatch_ref: string | null
          dispatched_at: string | null
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
          dispatch_ref?: string | null
          dispatched_at?: string | null
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
          dispatch_ref?: string | null
          dispatched_at?: string | null
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
            foreignKeyName: "promotion_communications_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
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
          {
            foreignKeyName: "promotion_communications_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "access_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      recertification_prompts: {
        Row: {
          channel: string
          contact_id: string
          created_at: string
          delivered: boolean
          detail: Json
          id: string
          prompt_kind: string
          sent_at: string
          statement_id: string
        }
        Insert: {
          channel?: string
          contact_id: string
          created_at?: string
          delivered?: boolean
          detail?: Json
          id?: string
          prompt_kind: string
          sent_at?: string
          statement_id: string
        }
        Update: {
          channel?: string
          contact_id?: string
          created_at?: string
          delivered?: boolean
          detail?: Json
          id?: string
          prompt_kind?: string
          sent_at?: string
          statement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recertification_prompts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recertification_prompts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "v_contact_certification"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "recertification_prompts_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "investor_statements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recertification_prompts_statement_id_fkey"
            columns: ["statement_id"]
            isOneToOne: false
            referencedRelation: "v_contact_certification"
            referencedColumns: ["statement_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
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
      fn_promotion_orphans: {
        Args: { p_at?: string; p_grace_minutes?: number }
        Returns: {
          channel: string
          communication_id: string
          contact_id: string
          sent_at: string
          statement_id: string
        }[]
      }
      fn_recertification_due: {
        Args: { p_at?: string; p_window_days?: number }
        Returns: {
          contact_id: string
          days_remaining: number
          email: string
          expires_at: string
          full_name: string
          statement_id: string
        }[]
      }
      fn_retention_candidates: {
        Args: { p_at?: string; p_years?: number }
        Returns: {
          contact_id: string
          cutoff_at: string
          last_promotion_at: string
          statement_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "compliance"
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
      app_role: ["admin", "compliance"],
      statement_kind: ["hnw", "scsi"],
    },
  },
} as const
