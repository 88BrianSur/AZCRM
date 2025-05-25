import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    // Test environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: "Missing environment variables",
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey,
        },
      })
    }

    // Test Supabase connection
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.getSession()

    return NextResponse.json({
      success: true,
      environment: {
        supabaseUrl: supabaseUrl.substring(0, 30) + "...",
        keyLength: supabaseKey.length,
      },
      session: {
        hasSession: !!data.session,
        error: error?.message,
      },
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: "Server error",
      details: err instanceof Error ? err.message : String(err),
    })
  }
}
