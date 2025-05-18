"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { z } from "zod"

// Define the schema for client data validation
const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  status: z.string().default("Active"),
  programType: z.string().optional().nullable(),
  intakeDate: z.string().min(1, "Intake date is required"),
  dischargeDate: z.string().optional().nullable(),
  assignedCounselor: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type ClientFormData = z.infer<typeof clientSchema>

export async function createClient(formData: ClientFormData) {
  try {
    // Validate form data
    const validatedData = clientSchema.parse(formData)

    // Get the current user for the created_by field
    const supabase = createServerSupabaseClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: "You must be logged in to create a client" }
    }

    // Format the data for Supabase
    const clientData = {
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      date_of_birth: validatedData.dateOfBirth,
      gender: validatedData.gender,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      address: validatedData.address || null,
      city: validatedData.city || null,
      state: validatedData.state || null,
      zip_code: validatedData.zipCode || null,
      status: validatedData.status,
      program_type: validatedData.programType || null,
      intake_date: validatedData.intakeDate,
      discharge_date: validatedData.dischargeDate || null,
      assigned_counselor: validatedData.assignedCounselor || null,
      created_by: session.user.id,
      updated_by: session.user.id,
    }

    // Insert the client into the database
    const { data, error } = await supabase.from("clients").insert(clientData).select()

    if (error) {
      console.error("Error creating client:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the clients page to show the new client
    revalidatePath("/clients")

    return {
      success: true,
      message: `Client ${validatedData.firstName} ${validatedData.lastName} created successfully`,
      client: data[0],
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors,
      }
    }

    console.error("Error creating client:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
