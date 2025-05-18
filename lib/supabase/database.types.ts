export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: "admin" | "staff" | "client"
          created_at: string
          updated_at: string
          last_login: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: "admin" | "staff" | "client"
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: "admin" | "staff" | "client"
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
      }
      clients: {
        Row: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string
          gender: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          status: string
          program_type: string | null
          intake_date: string
          discharge_date: string | null
          assigned_counselor: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          date_of_birth: string
          gender: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          status?: string
          program_type?: string | null
          intake_date: string
          discharge_date?: string | null
          assigned_counselor?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string
          gender?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          status?: string
          program_type?: string | null
          intake_date?: string
          discharge_date?: string | null
          assigned_counselor?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          client_id: string
          name: string
          relationship: string
          phone: string
          email: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          relationship: string
          phone: string
          email?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          relationship?: string
          phone?: string
          email?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      medical_info: {
        Row: {
          id: string
          client_id: string
          insurance_provider: string | null
          insurance_policy_number: string | null
          insurance_group_number: string | null
          primary_physician: string | null
          physician_phone: string | null
          allergies: string | null
          medications: string | null
          medical_conditions: string | null
          created_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          client_id: string
          insurance_provider?: string | null
          insurance_policy_number?: string | null
          insurance_group_number?: string | null
          primary_physician?: string | null
          physician_phone?: string | null
          allergies?: string | null
          medications?: string | null
          medical_conditions?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          insurance_provider?: string | null
          insurance_policy_number?: string | null
          insurance_group_number?: string | null
          primary_physician?: string | null
          physician_phone?: string | null
          allergies?: string | null
          medications?: string | null
          medical_conditions?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
      }
      legal_info: {
        Row: {
          id: string
          client_id: string
          legal_status: "none" | "probation" | "parole" | "court-ordered" | "other"
          court_dates: string | null
          probation_officer: string | null
          probation_officer_phone: string | null
          legal_notes: string | null
          created_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          client_id: string
          legal_status?: "none" | "probation" | "parole" | "court-ordered" | "other"
          court_dates?: string | null
          probation_officer?: string | null
          probation_officer_phone?: string | null
          legal_notes?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          legal_status?: "none" | "probation" | "parole" | "court-ordered" | "other"
          court_dates?: string | null
          probation_officer?: string | null
          probation_officer_phone?: string | null
          legal_notes?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
      }
      progress_notes: {
        Row: {
          id: string
          client_id: string
          category: "progress" | "medical" | "therapy" | "case_management" | "incident" | "general"
          title: string
          content: string
          created_at: string
          updated_at: string
          author_id: string
          is_private: boolean
        }
        Insert: {
          id?: string
          client_id: string
          category?: "progress" | "medical" | "therapy" | "case_management" | "incident" | "general"
          title: string
          content: string
          created_at?: string
          updated_at?: string
          author_id: string
          is_private?: boolean
        }
        Update: {
          id?: string
          client_id?: string
          category?: "progress" | "medical" | "therapy" | "case_management" | "incident" | "general"
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
          author_id?: string
          is_private?: boolean
        }
      }
      sobriety_tracking: {
        Row: {
          id: string
          client_id: string
          check_in_date: string
          is_sober: boolean
          mood_rating: number | null
          triggers: string | null
          coping_strategies: string | null
          notes: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          client_id: string
          check_in_date: string
          is_sober: boolean
          mood_rating?: number | null
          triggers?: string | null
          coping_strategies?: string | null
          notes?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          client_id?: string
          check_in_date?: string
          is_sober?: boolean
          mood_rating?: number | null
          triggers?: string | null
          coping_strategies?: string | null
          notes?: string | null
          created_at?: string
          created_by?: string
        }
      }
      sobriety_milestones: {
        Row: {
          id: string
          client_id: string
          milestone_date: string
          days_sober: number
          milestone_type: string
          notes: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          client_id: string
          milestone_date: string
          days_sober: number
          milestone_type: string
          notes?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          client_id?: string
          milestone_date?: string
          days_sober?: number
          milestone_type?: string
          notes?: string | null
          created_at?: string
          created_by?: string
        }
      }
      staff_schedules: {
        Row: {
          id: string
          staff_id: string
          shift_date: string
          shift_type: "morning" | "afternoon" | "evening" | "night" | "on-call"
          start_time: string
          end_time: string
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          staff_id: string
          shift_date: string
          shift_type: "morning" | "afternoon" | "evening" | "night" | "on-call"
          start_time: string
          end_time: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          staff_id?: string
          shift_date?: string
          shift_type?: "morning" | "afternoon" | "evening" | "night" | "on-call"
          start_time?: string
          end_time?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      staff_availability: {
        Row: {
          id: string
          staff_id: string
          day_of_week: number
          is_available: boolean
          start_time: string | null
          end_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          staff_id: string
          day_of_week: number
          is_available?: boolean
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          staff_id?: string
          day_of_week?: number
          is_available?: boolean
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      alumni: {
        Row: {
          id: string
          client_id: string
          graduation_date: string
          current_status: string
          employment_status: string | null
          housing_status: string | null
          contact_frequency: string | null
          last_contact_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          client_id: string
          graduation_date: string
          current_status: string
          employment_status?: string | null
          housing_status?: string | null
          contact_frequency?: string | null
          last_contact_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          graduation_date?: string
          current_status?: string
          employment_status?: string | null
          housing_status?: string | null
          contact_frequency?: string | null
          last_contact_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
          updated_by?: string | null
        }
      }
      alumni_engagement: {
        Row: {
          id: string
          alumni_id: string
          engagement_date: string
          engagement_type: string
          notes: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          alumni_id: string
          engagement_date: string
          engagement_type: string
          notes?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          alumni_id?: string
          engagement_date?: string
          engagement_type?: string
          notes?: string | null
          created_at?: string
          created_by?: string
        }
      }
      documents: {
        Row: {
          id: string
          client_id: string | null
          document_name: string
          document_type: string
          storage_path: string
          uploaded_at: string
          uploaded_by: string
          file_size: number
          is_confidential: boolean
        }
        Insert: {
          id?: string
          client_id?: string | null
          document_name: string
          document_type: string
          storage_path: string
          uploaded_at?: string
          uploaded_by: string
          file_size: number
          is_confidential?: boolean
        }
        Update: {
          id?: string
          client_id?: string | null
          document_name?: string
          document_type?: string
          storage_path?: string
          uploaded_at?: string
          uploaded_by?: string
          file_size?: number
          is_confidential?: boolean
        }
      }
      alerts: {
        Row: {
          id: string
          type: "medication" | "appointment" | "documentation" | "legal" | "insurance" | "custom"
          title: string
          description: string
          client_id: string | null
          created_at: string
          due_date: string
          status: "active" | "snoozed" | "resolved"
          priority: "low" | "medium" | "high" | "urgent"
          assigned_to: string | null
          resolved_at: string | null
          resolved_by: string | null
          snooze_until: string | null
          related_record_id: string | null
          related_record_type: string | null
          related_record_url: string | null
        }
        Insert: {
          id?: string
          type: "medication" | "appointment" | "documentation" | "legal" | "insurance" | "custom"
          title: string
          description: string
          client_id?: string | null
          created_at?: string
          due_date: string
          status?: "active" | "snoozed" | "resolved"
          priority?: "low" | "medium" | "high" | "urgent"
          assigned_to?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          snooze_until?: string | null
          related_record_id?: string | null
          related_record_type?: string | null
          related_record_url?: string | null
        }
        Update: {
          id?: string
          type?: "medication" | "appointment" | "documentation" | "legal" | "insurance" | "custom"
          title?: string
          description?: string
          client_id?: string | null
          created_at?: string
          due_date?: string
          status?: "active" | "snoozed" | "resolved"
          priority?: "low" | "medium" | "high" | "urgent"
          assigned_to?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          snooze_until?: string | null
          related_record_id?: string | null
          related_record_type?: string | null
          related_record_url?: string | null
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action_type: string
          entity_type: string
          entity_id: string | null
          description: string
          created_at: string
          ip_address: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          action_type: string
          entity_type: string
          entity_id?: string | null
          description: string
          created_at?: string
          ip_address?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          action_type?: string
          entity_type?: string
          entity_id?: string | null
          description?: string
          created_at?: string
          ip_address?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: "admin" | "staff" | "client"
      }
    }
    Enums: {
      user_role: "admin" | "staff" | "client"
      client_status: "Active" | "Inactive" | "Pending" | "Discharged" | "Graduated" | "On Leave"
      program_type: "1/2 way" | "LFW" | "3/4" | "Jackies House" | "Falkenstein Fortress" | "Olive Branch"
      gender_type: "male" | "female" | "non-binary" | "other" | "prefer-not-to-say"
      legal_status: "none" | "probation" | "parole" | "court-ordered" | "other"
      note_category: "progress" | "medical" | "therapy" | "case_management" | "incident" | "general"
      shift_type: "morning" | "afternoon" | "evening" | "night" | "on-call"
      alert_type: "medication" | "appointment" | "documentation" | "legal" | "insurance" | "custom"
      alert_status: "active" | "snoozed" | "resolved"
      alert_priority: "low" | "medium" | "high" | "urgent"
    }
  }
}
