"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/auth/login-form"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function DebugLoginPage() {
  const [sessionStatus, setSessionStatus] = useState<{
    status: "checking" | "authenticated" | "unauthenticated"
    message?: string
  }>({ status: "checking" })
  const [cookies, setCookies] = useState<string[]>([])
  const supabase = createClientSupabaseClient()

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        // Get all cookies for debugging
        const allCookies = document.cookie.split(";").map((cookie) => cookie.trim())
        setCookies(allCookies)

        if (error) {
          console.error("Session check error:", error)
          setSessionStatus({
            status: "unauthenticated",
            message: `Error checking session: ${error.message}`,
          })
          return
        }

        if (session) {
          setSessionStatus({
            status: "authenticated",
            message: `Authenticated as: ${session.user.email}`,
          })
        } else {
          setSessionStatus({
            status: "unauthenticated",
            message: "No active session found",
          })
        }
      } catch (err) {
        console.error("Session check exception:", err)
        setSessionStatus({
          status: "unauthenticated",
          message: `Exception checking session: ${err instanceof Error ? err.message : String(err)}`,
        })
      }
    }

    checkSession()
  }, [supabase])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Debug Login Page</h1>
          <p className="mt-2 text-gray-600">This page bypasses middleware checks for testing purposes</p>
        </div>

        {/* Session Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Session Status</CardTitle>
            <CardDescription>Current authentication state</CardDescription>
          </CardHeader>
          <CardContent>
            {sessionStatus.status === "checking" ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Checking authentication status...</AlertDescription>
              </Alert>
            ) : sessionStatus.status === "authenticated" ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">{sessionStatus.message}</AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{sessionStatus.message}</AlertDescription>
              </Alert>
            )}

            {/* Cookie Debug Info */}
            <div className="mt-4">
              <h3 className="font-medium mb-2">Cookies:</h3>
              <div className="bg-gray-50 p-2 rounded text-xs font-mono overflow-auto max-h-32">
                {cookies.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {cookies.map((cookie, i) => (
                      <li key={i}>{cookie}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No cookies found</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <LoginForm callbackUrl="/dashboard" debugMode={true} />

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This is a temporary debug page.</p>
          <p>Use it to test login functionality without middleware interference.</p>
        </div>
      </div>
    </div>
  )
}
