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
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string
          status: string
          author_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content: string
          status?: string
          author_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string
          status?: string
          author_id?: string
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
          description?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          description: string
          link: string
          author: string
          status: string
          submitted_by: string
          category_id: string
          subcategory_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          description: string
          link: string
          author: string
          status?: string
          submitted_by: string
          category_id: string
          subcategory_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          description?: string
          link?: string
          author?: string
          status?: string
          submitted_by?: string
          category_id?: string
          subcategory_id?: string
        }
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          user_id: string
          content: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          content: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          content?: string
          status?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string | null
          avatar_url: string | null
          role: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          role?: string
        }
      }
      subcategories: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          description: string | null
          category_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
          description?: string | null
          category_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
          description?: string | null
          category_id?: string
        }
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
  }
}
