import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Get current session
export async function getSession() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}

// Get current user
export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  if (!session) {
    return null
  }

  const { data } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  return (
    data || {
      id: session.user.id,
      email: session.user.email,
      role: "staff", // Default role if not found in database
    }
  )
}

// Check if user has a specific role
export async function hasRole(requiredRole: string) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  // Admin has access to everything
  if (user.role === "admin") {
    return true
  }

  return user.role === requiredRole
}

// Middleware to require authentication
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return session
}

// Middleware to require admin role
export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/unauthorized")
  }
}

// Middleware to require staff role (or admin)
export async function requireStaff() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    redirect("/unauthorized")
  }
}
