import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Simple client creation without SSR complications
export function createClientSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    })
    throw new Error("Missing Supabase environment variables")
  }

  console.log("Creating Supabase client with:", {
    url: supabaseUrl.substring(0, 30) + "...",
    keyLength: supabaseAnonKey.length,
  })

  // Use the standard createClient for better compatibility
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClientSupabaseClient> | null = null

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClientSupabaseClient()
  }
  return supabaseInstance
}

// Helper functions
export async function getSession() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      return null
    }

    return data.session
  } catch (err) {
    console.error("Exception getting session:", err)
    return null
  }
}

export async function getCurrentUser() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting user:", error)
      return null
    }

    return data.user
  } catch (err) {
    console.error("Exception getting user:", err)
    return null
  }
}

// For backward compatibility
export const supabase = getSupabaseClient()
