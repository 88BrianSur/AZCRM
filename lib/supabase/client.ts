import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

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

    console.log("Creating Supabase client with URL:", supabaseUrl.substring(0, 15) + "...")

    // Create the client without custom cookie handling to use document.cookie API automatically
    supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

// Helper function to get user session on the client side
export async function getSession() {
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
export async function getCurrentUser() {
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
export async function getUserProfile() {
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

// For backward compatibility
export const supabase = createClientSupabaseClient()
