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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          paystack_reference: string
          status: 'pending' | 'paid' | 'processing' | 'shipped' | 'cancelled'
          shipping_details: Json
          language_preference: 'en' | 'af'
          subtotal: number
          shipping_cost: number
          total: number
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          paystack_reference: string
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'cancelled'
          shipping_details: Json
          language_preference?: 'en' | 'af'
          subtotal: number
          shipping_cost?: number
          total: number
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          paystack_reference?: string
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'cancelled'
          shipping_details?: Json
          language_preference?: 'en' | 'af'
          subtotal?: number
          shipping_cost?: number
          total?: number
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          sanity_product_id: string
          product_snapshot: Json
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          sanity_product_id: string
          product_snapshot: Json
          quantity?: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          sanity_product_id?: string
          product_snapshot?: Json
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
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

// Helper types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

// Shipping details interface
export interface ShippingDetails {
  full_name: string
  phone: string
  email: string
  address_line1: string
  address_line2?: string
  city: string
  state_province: string
  postal_code: string
  country: string
}

// Product snapshot interface
export interface ProductSnapshot {
  title: string
  slug: string
  base_price: number
  selected_options: {
    type: string
    value: string
    label: string
    price_modifier: number
  }[]
  image_url?: string
}
