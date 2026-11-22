// Supabase database types for the `public` schema.
//
// Hand-written from the live schema (PostgREST OpenAPI at <SUPABASE_URL>/rest/v1/), in the
// format `supabase gen types typescript` produces. Keep in sync with supabase/schema.sql.
// When a column is added or changed in the database, update the Row / Insert / Update types here.
//
// Timestamps are `timestamp without time zone` and arrive as ISO strings without an offset.
// `numeric` columns arrive as JSON numbers.

export type RegistrationStatus = "pending" | "verified" | "paid" | "completed" | "cancelled" | "denied"
export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled"

export type Database = {
  public: {
    Tables: {
      exam_levels: {
        Row: {
          id: number
          level: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          level: string
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          level?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          id: number
          level_id: number
          region: string
          address: string | null
          exam_date: string
          start_time: string
          end_time: string
          capacity: number
          registered_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          level_id: number
          region: string
          address?: string | null
          exam_date: string
          start_time: string
          end_time: string
          capacity?: number
          registered_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          level_id?: number
          region?: string
          address?: string | null
          exam_date?: string
          start_time?: string
          end_time?: string
          capacity?: number
          registered_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "exam_levels"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          id: number
          user_id: string | null
          exam_id: number
          first_name: string
          last_name: string
          phone_number: string
          email: string
          passport_number: string
          status: RegistrationStatus
          email_verified: boolean
          payment_verified: boolean
          registration_date: string
          created_at: string
          updated_at: string
          date_of_birth: string | null
          gender: string | null
          nationality: string | null
          country_of_birth: string | null
          city_of_birth: string | null
          current_address: string | null
          document_type: string | null
          exam_type: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          exam_id: number
          first_name: string
          last_name: string
          phone_number: string
          email: string
          passport_number: string
          status?: RegistrationStatus
          email_verified?: boolean
          payment_verified?: boolean
          registration_date?: string
          created_at?: string
          updated_at?: string
          date_of_birth?: string | null
          gender?: string | null
          nationality?: string | null
          country_of_birth?: string | null
          city_of_birth?: string | null
          current_address?: string | null
          document_type?: string | null
          exam_type?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          exam_id?: number
          first_name?: string
          last_name?: string
          phone_number?: string
          email?: string
          passport_number?: string
          status?: RegistrationStatus
          email_verified?: boolean
          payment_verified?: boolean
          registration_date?: string
          created_at?: string
          updated_at?: string
          date_of_birth?: string | null
          gender?: string | null
          nationality?: string | null
          country_of_birth?: string | null
          city_of_birth?: string | null
          current_address?: string | null
          document_type?: string | null
          exam_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          id: number
          provider_trn_id: number
          registration_id: number
          booking_id: string | null
          paynet_transaction_id: string | null
          amount: number
          payment_method: string
          status: PaymentStatus
          gateway: string | null
          transaction_id: string | null
          verified_at: string | null
          paid_at: string | null
          payer_inn: string | null
          check_id: string | null
          payme_transaction_id: string | null
          payme_create_time: string | null
          payme_perform_time: string | null
          payme_cancel_time: string | null
          payme_reason: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          provider_trn_id?: number
          registration_id: number
          booking_id?: string | null
          paynet_transaction_id?: string | null
          amount: number
          payment_method: string
          status?: PaymentStatus
          gateway?: string | null
          transaction_id?: string | null
          verified_at?: string | null
          paid_at?: string | null
          payer_inn?: string | null
          check_id?: string | null
          payme_transaction_id?: string | null
          payme_create_time?: string | null
          payme_perform_time?: string | null
          payme_cancel_time?: string | null
          payme_reason?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          provider_trn_id?: number
          registration_id?: number
          booking_id?: string | null
          paynet_transaction_id?: string | null
          amount?: number
          payment_method?: string
          status?: PaymentStatus
          gateway?: string | null
          transaction_id?: string | null
          verified_at?: string | null
          paid_at?: string | null
          payer_inn?: string | null
          check_id?: string | null
          payme_transaction_id?: string | null
          payme_create_time?: string | null
          payme_perform_time?: string | null
          payme_cancel_time?: string | null
          payme_reason?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          id: number
          email: string
          otp: string
          verified: boolean
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: number
          email: string
          otp: string
          verified?: boolean
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: number
          email?: string
          otp?: string
          verified?: boolean
          expires_at?: string
          created_at?: string
        }
        Relationships: []
      }
      telc_admins: {
        Row: {
          id: number
          email: string
          name: string | null
          role: string
          password_hash: string
          created_at: string
        }
        Insert: {
          id?: number
          email: string
          name?: string | null
          role?: string
          password_hash: string
          created_at?: string
        }
        Update: {
          id?: number
          email?: string
          name?: string | null
          role?: string
          password_hash?: string
          created_at?: string
        }
        Relationships: []
      }
      telc_admin_sessions: {
        Row: {
          id: number
          admin_id: number
          token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: number
          admin_id: number
          token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: number
          admin_id?: number
          token?: string
          expires_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "telc_admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "telc_admins"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      registration_status: RegistrationStatus
      payment_status: PaymentStatus
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicTables = Database["public"]["Tables"]
export type Tables<T extends keyof PublicTables> = PublicTables[T]["Row"]
export type TablesInsert<T extends keyof PublicTables> = PublicTables[T]["Insert"]
export type TablesUpdate<T extends keyof PublicTables> = PublicTables[T]["Update"]

// Row shapes the admin UI receives from /api/telc/* (rows plus embedded relations)
export type ExamLevel = Tables<"exam_levels">
export type Exam = Tables<"exams">
export type Registration = Tables<"registrations">
export type Payment = Tables<"payments">

// ── Shapes returned by /api/telc/* to the browser (rows plus embedded relations) ──

/** GET /api/telc/exams — registered_count is recomputed from live registrations */
export type ApiExam = Pick<
  Exam,
  "id" | "region" | "address" | "exam_date" | "start_time" | "end_time" | "capacity" | "registered_count" | "is_active" | "level_id"
> & { exam_levels: Pick<ExamLevel, "level" | "price"> | null }

/** GET /api/telc/registrations (admin) */
export type ApiRegistration = Registration & {
  exams:
    | (Pick<Exam, "region" | "address" | "exam_date" | "start_time" | "end_time" | "level_id"> & {
        exam_levels: Pick<ExamLevel, "level" | "price"> | null
      })
    | null
}

/** GET /api/telc/payments (admin) */
export type ApiPayment = Payment & {
  registrations: Pick<Registration, "id" | "first_name" | "last_name" | "email" | "passport_number" | "phone_number"> | null
}
