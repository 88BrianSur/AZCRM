// Temporarily disabled middleware for testing
// To re-enable, remove the .disabled extension from the filename

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a dummy middleware that does nothing
export function middleware(req: NextRequest) {
  // Simply pass through all requests without any authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Empty matcher means this middleware won't run on any routes
  ],
}

/* ORIGINAL MIDDLEWARE (for reference, to restore later)
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next()

  // Skip middleware for login page to prevent redirect loops
  if (req.nextUrl.pathname === "/auth/login") {
    return res
  }

  // Create a Supabase client specifically for the middleware
  const supabase = createMiddlewareClient({ req, res })

  // This properly checks the session using Supabase's methods
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/clients",
    "/progress-notes",
    "/sobriety-tracker",
    "/staff-scheduling",
    "/alumni-management",
    "/alerts",
    "/admin",
  ]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`),
  )

  // If accessing a protected route without a session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/login", req.url)
    redirectUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing root with a session, redirect to dashboard
  if (req.nextUrl.pathname === "/" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
*/
