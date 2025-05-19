"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/auth/login-form"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <Card className="border-2 border-yellow-400">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="text-center text-xl font-bold">🔍 Debug Login Page</CardTitle>
            <CardDescription className="text-center">
              This page bypasses middleware for testing authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm">
              <p className="font-medium">Debug Information:</p>
              <p>• Check browser console for detailed session logs</p>
              <p>• Successful login will redirect to /dashboard</p>
              <p>• Authentication errors will be displayed below</p>
            </div>
          </CardContent>
        </Card>

        <LoginForm callbackUrl="/dashboard" debugMode={true} />

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Open your browser console (F12) to view detailed session information</p>
        </div>
      </div>
    </div>
  )
}
