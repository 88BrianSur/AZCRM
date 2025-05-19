"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginForm({
  callbackUrl = "/dashboard",
  debugMode = false,
}: { callbackUrl?: string; debugMode?: boolean }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      console.log("Attempting to sign in with:", email)

      // Log debug info if in debug mode
      if (debugMode) {
        console.log("Debug mode enabled")
        console.log("Current cookies:", document.cookie)
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Auth error:", error.message)
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        console.log("User authenticated:", data.user.id)

        if (debugMode) {
          console.log("Auth response:", JSON.stringify(data))
          console.log("Session:", data.session)
          console.log("Cookies after auth:", document.cookie)
        }

        // Check if user is in the database
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (userError && userError.code !== "PGRST116") {
          console.error("User data error:", userError.message)
          setError("Error retrieving user profile. Please try again.")
          setIsLoading(false)
          return
        }

        // If user doesn't exist in the database yet, create a basic profile
        if (!userData) {
          console.log("Creating new user profile")
          const { error: insertError } = await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email,
            role: "staff", // Default role
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Error creating user profile:", insertError.message)
            setError("Error creating user profile. Please contact an administrator.")
            await supabase.auth.signOut()
            setIsLoading(false)
            return
          }
        } else {
          // Update last login time
          await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", data.user.id)
        }

        // Verify session is stored in cookies before redirecting
        const { data: sessionData } = await supabase.auth.getSession()

        if (debugMode) {
          console.log("Session verification:", sessionData)
          console.log("Final cookies before redirect:", document.cookie)
        }

        if (!sessionData.session) {
          console.error("Session not properly stored")
          setError("Authentication succeeded but session was not properly stored. Please try again.")
          setIsLoading(false)
          return
        }

        // Redirect to callback URL or dashboard
        console.log("Redirecting to:", callbackUrl)
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
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
          <Button type="submit" className="w-full" disabled={isLoading}>
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
      </CardFooter>
    </Card>
  )
}
