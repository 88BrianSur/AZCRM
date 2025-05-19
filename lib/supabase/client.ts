import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"
import { createClient } from "@supabase/supabase-js"

// Direct export of the supabase client - this is what v0 is looking for
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Create a singleton client for other functions to use
const supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

// Make sure the createClientSupabaseClient function properly sets cookies

// If the file doesn't have the proper cookie settings, update it to include:
export function createClientSupabaseClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      storageKey: "sb-access-token",
      storage: {
        getItem: (key) => {
          if (typeof window === "undefined") {
            return null
          }
          return document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${key}=`))
            ?.split("=")[1]
        },
        setItem: (key, value) => {
          if (typeof window !== "undefined") {
            document.cookie = `${key}=${value}; path=/; max-age=2592000; SameSite=Lax; secure`
          }
        },
        removeItem: (key) => {
          if (typeof window !== "undefined") {
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          }
        },
      },
    },
  })
}

// Helper function to get user session on the client side
export const getSession = async () => {
  const client = createClientSupabaseClient()
  const { data, error } = await client.auth.getSession()
  if (error) {
    console.error("Error getting session:", error.message)
    return null
  }
  return data.session
}

// Helper function to get user data
export const getCurrentUser = async () => {
  const client = createClientSupabaseClient()
  const {
    data: { user },
    error,
  } = await client.auth.getUser()
  if (error || !user) {
    console.error("Error getting user:", error?.message)
    return null
  }
  return user
}

// Helper function to get user profile with role information
export const getUserProfile = async () => {
  const client = createClientSupabaseClient()
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await client.from("users").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error getting user profile:", error.message)
    return null
  }

  return data
}
