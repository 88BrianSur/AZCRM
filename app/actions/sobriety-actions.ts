"use server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function getSobrietyData(clientId: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  try {
    // Get client's sobriety data
    const { data: sobrietyData, error: sobrietyError } = await supabase
      .from("sobriety_logs")
      .select("*")
      .eq("client_id", clientId)
      .order("check_in_date", { ascending: false })

    if (sobrietyError) throw sobrietyError

    // Get client's current streak
    const { data: clientData, error: clientError } = await supabase
      .from("clients")
      .select("current_streak, longest_streak, last_relapse_date, relapse_count")
      .eq("id", clientId)
      .single()

    if (clientError) throw clientError

    // Get milestone data
    const { data: milestoneData, error: milestoneError } = await supabase
      .from("sobriety_milestones")
      .select("*")
      .eq("client_id", clientId)
      .order("days", { ascending: true })

    if (milestoneError) throw milestoneError

    return {
      logs: sobrietyData || [],
      clientData: clientData || {},
      milestones: milestoneData || [],
    }
  } catch (error) {
    console.error("Error fetching sobriety data:", error)
    throw error
  }
}

export async function addSobrietyCheckIn(
  clientId: string,
  data: {
    status: "sober" | "relapse"
    notes: string
    check_in_date: string
  },
) {
  const supabase = createServerComponentClient<Database>({ cookies })

  try {
    // Add check-in to sobriety_logs
    const { data: logData, error: logError } = await supabase
      .from("sobriety_logs")
      .insert([
        {
          client_id: clientId,
          status: data.status,
          notes: data.notes,
          check_in_date: data.check_in_date || new Date().toISOString(),
        },
      ])
      .select()

    if (logError) throw logError

    // Update client's streak information
    let updateData: any = {}

    if (data.status === "sober") {
      // Increment current streak
      const { data: clientData } = await supabase
        .from("clients")
        .select("current_streak, longest_streak")
        .eq("id", clientId)
        .single()

      if (clientData) {
        const newStreak = (clientData.current_streak || 0) + 1
        updateData.current_streak = newStreak

        // Update longest streak if current streak is longer
        if (newStreak > (clientData.longest_streak || 0)) {
          updateData.longest_streak = newStreak
        }

        // Check for milestones
        const milestones = [30, 60, 90, 180, 365, 730, 1095] // 30, 60, 90 days, 6 months, 1, 2, 3 years
        if (milestones.includes(newStreak)) {
          await supabase.from("sobriety_milestones").insert([
            {
              client_id: clientId,
              days: newStreak,
              achieved_date: new Date().toISOString(),
              notes: `${newStreak} days of sobriety achieved!`,
            },
          ])
        }
      }
    } else {
      // Reset current streak and record relapse
      updateData = {
        current_streak: 0,
        last_relapse_date: data.check_in_date || new Date().toISOString(),
        relapse_count: supabase.rpc("increment_relapse_count", { client_id: clientId }),
      }
    }

    // Update client record
    const { error: updateError } = await supabase.from("clients").update(updateData).eq("id", clientId)

    if (updateError) throw updateError

    return { success: true, data: logData }
  } catch (error) {
    console.error("Error adding sobriety check-in:", error)
    throw error
  }
}

export async function addMilestoneNote(milestoneId: string, note: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  try {
    const { error } = await supabase.from("sobriety_milestones").update({ notes: note }).eq("id", milestoneId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error adding milestone note:", error)
    throw error
  }
}

// Get client sobriety data
// export async function getClientSobrietyData(clientId: string) {
//   const supabase = createClientComponentClient<Database>()

//   // Get client basic info
//   const { data: client, error: clientError } = await supabase.from("clients").select("*").eq("id", clientId).single()

//   if (clientError) {
//     console.error("Error fetching client:", clientError)
//     return { error: "Failed to fetch client data" }
//   }

//   // Get sobriety logs for the client
//   const { data: logs, error: logsError } = await supabase
//     .from("sobriety_logs")
//     .select("*")
//     .eq("client_id", clientId)
//     .order("check_in_date", { ascending: true })

//   if (logsError) {
//     console.error("Error fetching sobriety logs:", logsError)
//     return { error: "Failed to fetch sobriety logs" }
//   }

//   // Calculate metrics
//   const metrics = calculateSobrietyMetrics(client, logs || [])

//   return {
//     client,
//     logs: logs || [],
//     metrics,
//   }
// }

// Record a new check-in
// export async function recordSobrietyCheckIn(data: {
//   clientId: string
//   status: "clean" | "relapse"
//   date: string
//   notes?: string
// }) {
//   const supabase = createClientComponentClient<Database>()

//   const { data: result, error } = await supabase
//     .from("sobriety_logs")
//     .insert({
//       client_id: data.clientId,
//       status: data.status,
//       check_in_date: data.date,
//       notes: data.notes || null,
//     })
//     .select()

//   if (error) {
//     console.error("Error recording check-in:", error)
//     return { error: "Failed to record check-in" }
//   }

//   // Update client's current streak if needed
//   if (data.status === "clean") {
//     // Update the client's current streak
//     await updateClientSobrietyStreak(data.clientId)
//   } else if (data.status === "relapse") {
//     // Reset the client's current streak
//     await resetClientSobrietyStreak(data.clientId, data.date)
//   }

//   revalidatePath(`/clients/${data.clientId}`)
//   revalidatePath("/sobriety-tracker")

//   return { success: true, data: result }
// }

// Add note to milestone or relapse
// export async function addSobrietyNote(data: {
//   logId: string
//   notes: string
// }) {
//   const supabase = createClientComponentClient<Database>()

//   const { data: result, error } = await supabase
//     .from("sobriety_logs")
//     .update({ notes: data.notes })
//     .eq("id", data.logId)
//     .select()

//   if (error) {
//     console.error("Error adding note:", error)
//     return { error: "Failed to add note" }
//   }

//   return { success: true, data: result }
// }

// Helper function to calculate sobriety metrics
function calculateSobrietyMetrics(client: any, logs: any[]) {
  // Filter logs to separate clean check-ins and relapses
  const cleanCheckIns = logs.filter((log) => log.status === "clean")
  const relapses = logs.filter((log) => log.status === "relapse")

  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime())

  // Calculate current streak
  const currentStreak = client.current_streak || 0

  // Find last relapse
  const lastRelapse =
    relapses.length > 0
      ? relapses.sort((a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime())[0]
      : null

  // Calculate longest streak
  const longestStreak = client.longest_streak || currentStreak

  // Calculate time since program entry
  const programEntryDate = client.admission_date || client.created_at
  const daysSinceEntry = programEntryDate
    ? Math.floor((new Date().getTime() - new Date(programEntryDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  // Calculate milestones achieved
  const milestones = [7, 30, 60, 90, 180, 365]
  const achievedMilestones = milestones.filter((m) => currentStreak >= m)

  // Next milestone
  const nextMilestone = milestones.find((m) => m > currentStreak) || (Math.floor(currentStreak / 365) + 1) * 365

  return {
    currentStreak,
    longestStreak,
    lastRelapse,
    relapseCount: relapses.length,
    achievedMilestones,
    nextMilestone,
    daysSinceEntry,
    programEntryDate,
  }
}

// Helper function to update client's sobriety streak
async function updateClientSobrietyStreak(clientId: string) {
  const supabase = createClientComponentClient<Database>()

  // Get client's current streak
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("current_streak, longest_streak")
    .eq("id", clientId)
    .single()

  if (clientError) {
    console.error("Error fetching client streak:", clientError)
    return
  }

  // Increment streak
  const newStreak = (client.current_streak || 0) + 1
  const longestStreak = Math.max(newStreak, client.longest_streak || 0)

  // Update client record
  await supabase
    .from("clients")
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_check_in: new Date().toISOString(),
    })
    .eq("id", clientId)
}

// Helper function to reset client's sobriety streak
async function resetClientSobrietyStreak(clientId: string, relapseDate: string) {
  const supabase = createClientComponentClient<Database>()

  // Reset streak to 0
  await supabase
    .from("clients")
    .update({
      current_streak: 0,
      last_relapse_date: relapseDate,
      last_check_in: new Date().toISOString(),
    })
    .eq("id", clientId)
}
