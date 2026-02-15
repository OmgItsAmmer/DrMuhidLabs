export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          youtube_url: string
          thumbnail_url: string | null
          price: number | null
          uploaded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          youtube_url: string
          thumbnail_url?: string | null
          price?: number | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          youtube_url?: string
          thumbnail_url?: string | null
          price?: number | null
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      course_images: {
        Row: {
          id: string
          course_id: string
          image_url: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          image_url: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          image_url?: string
          sort_order?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          course_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          transaction_id: string
          status: 'pending' | 'verified' | 'rejected'
          created_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          transaction_id: string
          status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          transaction_id?: string
          status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
      }
      user_course_access: {
        Row: {
          id: string
          user_id: string
          course_id: string
          granted_at: string
          granted_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          granted_at?: string
          granted_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          granted_at?: string
          granted_by?: string | null
        }
      }
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type CourseImage = Database['public']['Tables']['course_images']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type UserCourseAccess = Database['public']['Tables']['user_course_access']['Row']

// Extended types for joins
export type CourseWithImages = Course & {
  course_images: CourseImage[]
}

export type CourseWithDetails = Course & {
  course_images: CourseImage[]
  reviews: (Review & { profiles: Pick<Profile, 'full_name' | 'avatar_url'> })[]
  uploaded_by_profile: Pick<Profile, 'full_name'> | null
}

export type PaymentWithDetails = Payment & {
  profiles: Pick<Profile, 'full_name' | 'email'>
  courses: Pick<Course, 'title' | 'thumbnail_url'>
}
