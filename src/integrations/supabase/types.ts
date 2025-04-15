export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dim_age_band_rows: {
        Row: {
          age_band: string
        }
        Insert: {
          age_band: string
        }
        Update: {
          age_band?: string
        }
        Relationships: []
      }
      dim_geography_rows: {
        Row: {
          local_authority_code: string
          local_authority_name: string | null
        }
        Insert: {
          local_authority_code: string
          local_authority_name?: string | null
        }
        Update: {
          local_authority_code?: string
          local_authority_name?: string | null
        }
        Relationships: []
      }
      dim_industry_rows: {
        Row: {
          industry_code: number
          industry_name: string | null
          notes: string | null
        }
        Insert: {
          industry_code: number
          industry_name?: string | null
          notes?: string | null
        }
        Update: {
          industry_code?: number
          industry_name?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      dim_occupation_rows: {
        Row: {
          occupation_title: string | null
          soc_code: string
        }
        Insert: {
          occupation_title?: string | null
          soc_code: string
        }
        Update: {
          occupation_title?: string | null
          soc_code?: string
        }
        Relationships: []
      }
      dim_qualification_rows: {
        Row: {
          qualification: string
        }
        Insert: {
          qualification: string
        }
        Update: {
          qualification?: string
        }
        Relationships: []
      }
      dim_sex_rows: {
        Row: {
          sex: string
        }
        Insert: {
          sex: string
        }
        Update: {
          sex?: string
        }
        Relationships: []
      }
      dim_time_rows: {
        Row: {
          year: number
        }
        Insert: {
          year: number
        }
        Update: {
          year?: number
        }
        Relationships: []
      }
      employee_profile: {
        Row: {
          employee_id: number
          soc_code: number | null
        }
        Insert: {
          employee_id: number
          soc_code?: number | null
        }
        Update: {
          employee_id?: number
          soc_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_profile_soc_code_fkey"
            columns: ["soc_code"]
            isOneToOne: false
            referencedRelation: "job_risk"
            referencedColumns: ["soc_code"]
          },
        ]
      }
      ess_iit_11_22_rows: {
        Row: {
          country_code: string
          country_name: string | null
          employees: string | null
          estab_size: string | null
          geographic_level: string | null
          iit_code: string
          iit_sample_size: string | null
          region_code: string | null
          region_name: string | null
          sector: string | null
          sum_off_job_mn: string | null
          sum_on_job_mn: string | null
          sum_total_mn: string | null
          time_identifier: string | null
          time_period: number | null
          total_per_employee: string | null
          total_per_trainee: string | null
          trainees: string | null
          twentytwo_inflaton_sum_off_job_mn: string | null
          twentytwo_inflaton_sum_on_job_mn: string | null
          twentytwo_prices_sum_total_mn: string | null
          twentytwo_prices_total_per_employee: string | null
          twentytwo_prices_total_per_trainee: string | null
        }
        Insert: {
          country_code: string
          country_name?: string | null
          employees?: string | null
          estab_size?: string | null
          geographic_level?: string | null
          iit_code: string
          iit_sample_size?: string | null
          region_code?: string | null
          region_name?: string | null
          sector?: string | null
          sum_off_job_mn?: string | null
          sum_on_job_mn?: string | null
          sum_total_mn?: string | null
          time_identifier?: string | null
          time_period?: number | null
          total_per_employee?: string | null
          total_per_trainee?: string | null
          trainees?: string | null
          twentytwo_inflaton_sum_off_job_mn?: string | null
          twentytwo_inflaton_sum_on_job_mn?: string | null
          twentytwo_prices_sum_total_mn?: string | null
          twentytwo_prices_total_per_employee?: string | null
          twentytwo_prices_total_per_trainee?: string | null
        }
        Update: {
          country_code?: string
          country_name?: string | null
          employees?: string | null
          estab_size?: string | null
          geographic_level?: string | null
          iit_code?: string
          iit_sample_size?: string | null
          region_code?: string | null
          region_name?: string | null
          sector?: string | null
          sum_off_job_mn?: string | null
          sum_on_job_mn?: string | null
          sum_total_mn?: string | null
          time_identifier?: string | null
          time_period?: number | null
          total_per_employee?: string | null
          total_per_trainee?: string | null
          trainees?: string | null
          twentytwo_inflaton_sum_off_job_mn?: string | null
          twentytwo_inflaton_sum_on_job_mn?: string | null
          twentytwo_prices_sum_total_mn?: string | null
          twentytwo_prices_total_per_employee?: string | null
          twentytwo_prices_total_per_trainee?: string | null
        }
        Relationships: []
      }
      fact_demographic_automation_rows: {
        Row: {
          age_band: string
          high_risk: number | null
          low_risk: number | null
          medium_risk: number | null
          qualification: string | null
          sex: string | null
          total: number | null
          year: number | null
        }
        Insert: {
          age_band: string
          high_risk?: number | null
          low_risk?: number | null
          medium_risk?: number | null
          qualification?: string | null
          sex?: string | null
          total?: number | null
          year?: number | null
        }
        Update: {
          age_band?: string
          high_risk?: number | null
          low_risk?: number | null
          medium_risk?: number | null
          qualification?: string | null
          sex?: string | null
          total?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fact_demographic_automation_rows_qualification_fkey"
            columns: ["qualification"]
            isOneToOne: false
            referencedRelation: "dim_qualification_rows"
            referencedColumns: ["qualification"]
          },
          {
            foreignKeyName: "fact_demographic_automation_rows_year_fkey"
            columns: ["year"]
            isOneToOne: false
            referencedRelation: "dim_time_rows"
            referencedColumns: ["year"]
          },
        ]
      }
      fact_geographic_automation_rows: {
        Row: {
          high_risk: number | null
          local_authority_code: string
          low_risk: number | null
          medium_risk: number | null
          probability_of_automation: number | null
          year: number | null
        }
        Insert: {
          high_risk?: number | null
          local_authority_code: string
          low_risk?: number | null
          medium_risk?: number | null
          probability_of_automation?: number | null
          year?: number | null
        }
        Update: {
          high_risk?: number | null
          local_authority_code?: string
          low_risk?: number | null
          medium_risk?: number | null
          probability_of_automation?: number | null
          year?: number | null
        }
        Relationships: []
      }
      fact_industry_automation_rows: {
        Row: {
          high_risk: number | null
          industry_code: number
          low_risk: number | null
          medium_risk: number | null
          probability_of_automation: number | null
          year: number | null
        }
        Insert: {
          high_risk?: number | null
          industry_code: number
          low_risk?: number | null
          medium_risk?: number | null
          probability_of_automation?: number | null
          year?: number | null
        }
        Update: {
          high_risk?: number | null
          industry_code?: number
          low_risk?: number | null
          medium_risk?: number | null
          probability_of_automation?: number | null
          year?: number | null
        }
        Relationships: []
      }
      fact_skill_requirements_rows: {
        Row: {
          population_meeting_requirements: number | null
          proportion: number | null
          soc_code: number
          standard_error: number | null
          year: number | null
        }
        Insert: {
          population_meeting_requirements?: number | null
          proportion?: number | null
          soc_code: number
          standard_error?: number | null
          year?: number | null
        }
        Update: {
          population_meeting_requirements?: number | null
          proportion?: number | null
          soc_code?: number
          standard_error?: number | null
          year?: number | null
        }
        Relationships: []
      }
      job_risk: {
        Row: {
          automation_probability: number | null
          job_title: string | null
          soc_code: number
        }
        Insert: {
          automation_probability?: number | null
          job_title?: string | null
          soc_code: number
        }
        Update: {
          automation_probability?: number | null
          job_title?: string | null
          soc_code?: number
        }
        Relationships: []
      }
      workforce_reskilling_cases: {
        Row: {
          case_id: number
          certification_earned: boolean | null
          completion_date: string | null
          employee_id: number | null
          start_date: string | null
          training_program: string | null
        }
        Insert: {
          case_id: number
          certification_earned?: boolean | null
          completion_date?: string | null
          employee_id?: number | null
          start_date?: string | null
          training_program?: string | null
        }
        Update: {
          case_id?: number
          certification_earned?: boolean | null
          completion_date?: string | null
          employee_id?: number | null
          start_date?: string | null
          training_program?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workforce_reskilling_cases_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employee_profile"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      workforce_reskilling_events: {
        Row: {
          activity: string | null
          actor: string | null
          case_id: number | null
          completion_status: string | null
          event_id: number
          score: string | null
          skill_category: string | null
          timestamp: string | null
        }
        Insert: {
          activity?: string | null
          actor?: string | null
          case_id?: number | null
          completion_status?: string | null
          event_id: number
          score?: string | null
          skill_category?: string | null
          timestamp?: string | null
        }
        Update: {
          activity?: string | null
          actor?: string | null
          case_id?: number | null
          completion_status?: string | null
          event_id?: number
          score?: string | null
          skill_category?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workforce_reskilling_events_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "workforce_reskilling_cases"
            referencedColumns: ["case_id"]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
