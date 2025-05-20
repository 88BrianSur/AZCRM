import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Get the token from cookies or localStorage (for test mode)
  const token = req.cookies.get("sb-access-token")?.value

  // Log the token and request path for debugging
  console.log(`[Middleware] Path: ${req.nextUrl.pathname}`)
  console.log(`[Middleware] Token detected: ${token ? "Yes" : "No"}`)

  // Allow access to auth pages and Next.js system paths without authentication
  if (
    req.nextUrl.pathname.startsWith("/auth/") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname === "/"
  ) {
    console.log(`[Middleware] Allowing access to public path: ${req.nextUrl.pathname}`)
    return NextResponse.next()
  }

  // Redirect to login if trying to access dashboard without a token
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log(`[Middleware] No token, redirecting to login from: ${req.nextUrl.pathname}`)

    // Redirect to test login in preview environments for easier testing
    if (process.env.VERCEL_ENV === "preview") {
      return NextResponse.redirect(new URL("/auth/test-login", req.url))
    }

    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  // For all other paths, proceed
  console.log(`[Middleware] Proceeding with request to: ${req.nextUrl.pathname}`)
  return NextResponse.next()
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
