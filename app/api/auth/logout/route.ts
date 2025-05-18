import { type NextRequest, NextResponse } from "next/server"
import { logout } from "@/lib/auth/mock-auth"

export async function GET(request: NextRequest) {
  try {
    await logout()

    // Redirect to login page
    return NextResponse.redirect(new URL("/auth/login", request.url))
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
