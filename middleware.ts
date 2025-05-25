import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Log session status for debugging (will appear in server logs)
  console.log(`[Middleware] Path: ${req.nextUrl.pathname}`)
  console.log(`[Middleware] Session: ${session ? "Active" : "None"}`)

  // If no session and trying to access protected routes
  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log(`[Middleware] No session, redirecting to login from: ${req.nextUrl.pathname}`)
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // For all other paths, proceed with the response
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
