import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

async function getSupabaseServer() {
  const cookieStore = await cookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function getUser() {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getProfile(userId: string) {
  const supabase = await getSupabaseServer()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function getUserOrders(userId: string) {
  const supabase = await getSupabaseServer()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        sanity_product_id,
        product_snapshot,
        quantity,
        unit_price,
        total_price
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getAllOrders() {
  const supabase = await getSupabaseServer()
  
  // Check if user is admin (you can add a role field to profiles table)
  const user = await getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        sanity_product_id,
        product_snapshot,
        quantity,
        unit_price,
        total_price
      ),
      profiles (
        full_name,
        email,
        phone
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
