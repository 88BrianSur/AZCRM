import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

// Direct export of the supabase client - this is what the application expects
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Create a singleton client for consistent usage
let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClientSupabaseClient() {
  if (!supabaseClient) {
    // Make sure we have the environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing Supabase environment variables")
    }

    // Create the client with the standard browser client
    supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

// Helper function to get user session on the client side
export const getSession = async () => {
  try {
    const client = createClientSupabaseClient()
    const { data, error } = await client.auth.getSession()
    if (error) {
      console.error("Error getting session:", error.message)
      return null
    }
    return data.session
  } catch (err) {
    console.error("Exception getting session:", err)
    return null
  }
}

// Helper function to get user data
export const getCurrentUser = async () => {
  try {
    const client = createClientSupabaseClient()
    const { data, error } = await client.auth.getUser()
    if (error || !data.user) {
      console.error("Error getting user:", error?.message)
      return null
    }
    return data.user
  } catch (err) {
    console.error("Exception getting user:", err)
    return null
  }
}

// Helper function to get user profile with role information
export const getUserProfile = async () => {
  try {
    const client = createClientSupabaseClient()
    const user = await getCurrentUser()
    if (!user) return null

    const { data, error } = await client.from("users").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error getting user profile:", error.message)
      return null
    }

    return data
  } catch (err) {
    console.error("Exception getting user profile:", err)
    return null
  }
}
