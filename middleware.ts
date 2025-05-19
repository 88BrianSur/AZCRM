import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/reset-password",
    "/auth/update-password",
    "/api/auth/callback",
  ]

  // Check if the current path is public
  const isPublicPath = publicPaths.some(
    (path) => req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path),
  )

  // If it's a public path, allow access without checking auth
  if (isPublicPath) {
    return NextResponse.next()
  }

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

  // If it's a protected route, check for the sb-access-token cookie
  if (isProtectedRoute) {
    const token = req.cookies.get("sb-access-token")?.value

    // If no token is found, redirect to login
    if (!token) {
      const redirectUrl = new URL("/auth/login", req.url)
      redirectUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // For all other routes, just proceed
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
