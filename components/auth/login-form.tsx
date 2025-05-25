"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export default function LoginForm({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [envStatus, setEnvStatus] = useState<"checking" | "ok" | "error">("checking")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = createClientSupabaseClient()
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          console.log("User already logged in, redirecting to dashboard")
          // Use window.location for a full page reload to ensure middleware picks up the session
          window.location.href = callbackUrl
        }
      } catch (err) {
        console.error("Error checking session:", err)
      }
    }

    checkSession()
  }, [callbackUrl])

  // Check environment variables on component mount
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      setEnvStatus("error")
    } else {
      console.log("Environment variables present:", {
        supabaseUrl: supabaseUrl.substring(0, 10) + "...",
        keyLength: supabaseAnonKey.length,
      })
      setEnvStatus("ok")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setDebugInfo(null)
    setIsLoading(true)

    // Set a timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setError("Login request timed out. Please try again.")
        console.error("Login timeout - request did not complete in 15 seconds")
      }
    }, 15000)

    try {
      console.log("Login attempt with:", email)

      // Basic validation
      if (!email || !password) {
        clearTimeout(timeoutId)
        setError("Email and password are required")
        setIsLoading(false)
        return
      }

      // Check environment variables again
      if (envStatus === "error") {
        clearTimeout(timeoutId)
        setError("System configuration error. Please contact an administrator.")
        setIsLoading(false)
        return
      }

      // Get the Supabase client
      const supabase = createClientSupabaseClient()

      console.log("Supabase client created, attempting signInWithPassword")

      // Attempt to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      clearTimeout(timeoutId)

      if (signInError) {
        console.error("Auth error:", signInError.message)
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      if (!data.user || !data.session) {
        console.error("No user or session returned")
        setError("Authentication failed. Please try again.")
        setIsLoading(false)
        return
      }

      // Show debug info
      const debugText = `Login successful! User ID: ${data.user.id.substring(0, 6)}...
Session expires: ${new Date(data.session.expires_at! * 1000).toLocaleString()}
Redirecting to: ${callbackUrl}`

      setDebugInfo(debugText)
      console.log(debugText)

      // Wait a moment to show the success message
      setTimeout(() => {
        // Force a full page reload to ensure the session is picked up
        window.location.href = callbackUrl
      }, 1000)
    } catch (err) {
      clearTimeout(timeoutId)
      console.error("Login error:", err)
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        {envStatus === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Missing environment variables. Authentication will not work.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {debugInfo && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800 whitespace-pre-line">{debugInfo}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || envStatus === "error"}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Contact administrator
          </Link>
        </div>
        <div className="text-xs text-center text-muted-foreground">
          <p>Having trouble? Try these test credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: password123</p>
        </div>
      </CardFooter>
    </Card>
  )
}
