import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Get the token from cookies
  const token = req.cookies.get("sb-access-token")?.value

  // Log the token and request path for debugging
  console.log(`[Middleware] Path: ${req.nextUrl.pathname}`)
  console.log(`[Middleware] Token detected: ${token ? "Yes (length: " + token.length + ")" : "No"}`)

  // For security, don't log the full token in production
  if (process.env.NODE_ENV !== "production" && token) {
    console.log(`[Middleware] Token preview: ${token.substring(0, 10)}...`)
  }

  // Allow access to login, debug-login, and Next.js system paths
  if (
    req.nextUrl.pathname.startsWith("/auth/login") ||
    req.nextUrl.pathname.startsWith("/auth/debug-login") ||
    req.nextUrl.pathname.startsWith("/_next")
  ) {
    console.log(`[Middleware] Allowing access to public path: ${req.nextUrl.pathname}`)
    return NextResponse.next()
  }

  // Redirect to login if trying to access dashboard without a token
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log(`[Middleware] No token, redirecting to login from: ${req.nextUrl.pathname}`)
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
