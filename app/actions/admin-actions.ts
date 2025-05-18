"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// User Management Actions
export async function getUsers() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }

  return data || []
}

export async function createUser(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const password = formData.get("password") as string

  // First create the auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    console.error("Error creating auth user:", authError)
    throw new Error(authError.message)
  }

  // Then create the user profile
  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user.id,
    email,
    name,
    role,
    status: "Active",
  })

  if (profileError) {
    console.error("Error creating user profile:", profileError)
    throw new Error("Failed to create user profile")
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function updateUser(formData: FormData) {
  const supabase = createServerSupabaseClient()

  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const status = formData.get("status") as string

  const { error } = await supabase
    .from("users")
    .update({
      name,
      role,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating user:", error)
    throw new Error("Failed to update user")
  }

  revalidatePath("/admin")
  return { success: true }
}

export async function deleteUser(userId: string) {
  const supabase = createServerSupabaseClient()

  // First update the user status to inactive
  const { error: updateError } = await supabase
    .from("users")
    .update({
      status: "Inactive",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (updateError) {
    console.error("Error deactivating user:", updateError)
    throw new Error("Failed to deactivate user")
  }

  // We don't actually delete the auth user to maintain data integrity
  // But we could disable the user in auth if needed

  revalidatePath("/admin")
  return { success: true }
}

// Activity Logs Actions
export async function getActivityLogs(limit = 100) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching activity logs:", error)
    throw new Error("Failed to fetch activity logs")
  }

  return data || []
}

export async function logActivity(userId: string, action: string, details: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("activity_logs").insert({
    user_id: userId,
    action,
    details,
    ip_address: "server-action", // In a real app, you'd get the IP from the request
  })

  if (error) {
    console.error("Error logging activity:", error)
    // Don't throw here, just log the error
  }
}

// System Settings Actions
export async function getSystemSettings() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("system_settings").select("*")

  if (error) {
    console.error("Error fetching system settings:", error)
    throw new Error("Failed to fetch system settings")
  }

  // Convert array to object with key-value pairs
  const settings = {}
  data?.forEach((item) => {
    settings[item.key] = item.value
  })

  return settings
}

export async function updateSystemSettings(formData: FormData) {
  const supabase = createServerSupabaseClient()

  // Extract all form data as key-value pairs
  const updates = []
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("setting_")) {
      const settingKey = key.replace("setting_", "")
      updates.push({
        key: settingKey,
        value: value as string,
        updated_at: new Date().toISOString(),
      })
    }
  }

  // Use upsert to update or insert settings
  const { error } = await supabase.from("system_settings").upsert(updates, { onConflict: "key" })

  if (error) {
    console.error("Error updating system settings:", error)
    throw new Error("Failed to update system settings")
  }

  revalidatePath("/admin")
  return { success: true }
}

// Data Management Actions
export async function createBackup() {
  const supabase = createServerSupabaseClient()

  // In a real app, this would trigger a database backup process
  // For now, we'll just log the action

  const { error } = await supabase.from("backups").insert({
    type: "full",
    status: "completed",
    file_path: `/backups/full_${new Date().toISOString()}.sql`,
    created_by: "system",
  })

  if (error) {
    console.error("Error creating backup record:", error)
    throw new Error("Failed to create backup")
  }

  revalidatePath("/admin")
  return { success: true, message: "Backup created successfully" }
}

export async function getBackups() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("backups").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching backups:", error)
    throw new Error("Failed to fetch backups")
  }

  return data || []
}
