import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Mock authentication system
// This simulates an authentication system until you can connect to a real auth provider

// Session management with cookies
const SESSION_COOKIE_NAME = "az_house_session"

// Mock user credentials for demo purposes
const MOCK_USERS = [
  {
    email: "admin@azhouse.org",
    password: "admin123", // In a real app, this would be hashed
    id: "1",
    role: "admin",
    name: "Admin User",
  },
  {
    email: "staff@azhouse.org",
    password: "staff123",
    id: "2",
    role: "staff",
    name: "Staff Member",
  },
  {
    email: "support@azhouse.org",
    password: "support123",
    id: "3",
    role: "support",
    name: "Support Staff",
  },
]

// Login function
export async function login(email: string, password: string) {
  // Find user with matching credentials
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Create session
  const session = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  }

  // Store session in cookie
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: JSON.stringify(session),
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return { success: true, user: { id: user.id, email: user.email, role: user.role, name: user.name } }
}

// Register function (in a real app, this would create a new user)
export async function register(email: string, password: string, name: string) {
  // Check if user already exists
  const existingUser = MOCK_USERS.find((u) => u.email === email)

  if (existingUser) {
    return { success: false, error: "User with this email already exists" }
  }

  // In a real app, you would create a new user in the database
  // For this mock version, we'll just pretend it worked

  return { success: true, message: "Registration successful. Please log in." }
}

// Logout function
export async function logout() {
  cookies().delete(SESSION_COOKIE_NAME)
}

// Get current session
export async function getSession() {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      cookies().delete(SESSION_COOKIE_NAME)
      return null
    }

    return session
  } catch (error) {
    return null
  }
}

// Get current user
export async function getCurrentUser() {
  const session = await getSession()

  if (!session) {
    return null
  }

  // In a real app, you would fetch the user from the database
  const user = MOCK_USERS.find((u) => u.id === session.userId)

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  }
}

// Check if user has a specific role
export async function hasRole(requiredRole: string) {
  const user = await getCurrentUser()

  if (!user) {
    return false
  }

  // Admin has access to everything
  if (user.role === "admin") {
    return true
  }

  return user.role === requiredRole
}

// Middleware to require authentication
export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return session
}

// Middleware to require admin role
export async function requireAdmin() {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    redirect("/unauthorized")
  }
}

// Middleware to require staff role (or admin)
export async function requireStaff() {
  const user = await getCurrentUser()

  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    redirect("/unauthorized")
  }
}
