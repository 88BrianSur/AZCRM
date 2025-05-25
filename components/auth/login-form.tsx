"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseClient } from "@/lib/supabase/client"

interface LoginFormProps {
  callbackUrl?: string
}

export default function LoginForm({ callbackUrl = "/dashboard" }: LoginFormProps) {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebug = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const debugMessage = `[${timestamp}] ${message}`
    console.log(debugMessage)
    setDebugInfo((prev) => [...prev, debugMessage])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)
    setDebugInfo([]) // Clear previous debug info

    try {
      addDebug("=== LOGIN ATTEMPT STARTED ===")
      addDebug(`Email: ${email}`)
      addDebug(`Target URL: ${callbackUrl}`)

      // Validate inputs
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase environment variables are not configured")
      }

      addDebug("Creating Supabase client...")
      const supabase = getSupabaseClient()
      addDebug("Supabase client created successfully")

      addDebug("Attempting to sign in...")
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        addDebug(`Authentication error: ${error.message}`)
        throw new Error(error.message)
      }

      if (!data.user || !data.session) {
        addDebug("No user or session returned")
        throw new Error("Authentication failed: No user or session data")
      }

      addDebug(`Authentication successful!`)
      addDebug(`User: ${data.user.email}`)
      addDebug(`Session expires: ${new Date(data.session.expires_at! * 1000).toISOString()}`)

      setSuccess("Login successful! Redirecting...")
      addDebug("Setting success message and preparing redirect...")

      // Wait a moment to ensure session is fully set, then redirect
      setTimeout(() => {
        addDebug(`Redirecting to: ${callbackUrl}`)
        // Use a simple window.location redirect to avoid conflicts
        window.location.href = callbackUrl
      }, 1500) // Increased delay to ensure session is set
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      addDebug(`Login failed: ${errorMessage}`)
      setError(errorMessage)
      setIsLoading(false) // Only set loading to false on error
    }
    // Don't set isLoading to false on success - let the redirect happen
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {success ? "Redirecting..." : "Signing in..."}
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Debug Information */}
          {debugInfo.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium">Debug Information</summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono max-h-40 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="mb-1">
                    {info}
                  </div>
                ))}
              </div>
            </details>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">Test credentials are pre-filled above</div>
        </CardFooter>
      </Card>
    </div>
  )
}
