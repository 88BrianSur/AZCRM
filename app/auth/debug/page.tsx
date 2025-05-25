"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export default function AuthDebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [session, setSession] = useState<any>(null)
  const [cookies, setCookies] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true)
        setError(null)

        // Check environment variables
        const vars: Record<string, string> = {}
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
          vars["NEXT_PUBLIC_SUPABASE_URL"] = process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10) + "..."
        } else {
          vars["NEXT_PUBLIC_SUPABASE_URL"] = "MISSING"
        }

        if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          vars["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5) + "..."
        } else {
          vars["NEXT_PUBLIC_SUPABASE_ANON_KEY"] = "MISSING"
        }

        setEnvVars(vars)

        // Check cookies
        setCookies(document.cookie)

        // Check session
        const supabase = createClientSupabaseClient()
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          setError(sessionError.message)
        } else {
          setSession(data.session)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createClientSupabaseClient()
      await supabase.auth.signOut()
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
          <CardDescription>Diagnose authentication issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p>Loading authentication data...</p>
          ) : (
            <>
              {error && (
                <div className="p-4 bg-red-50 text-red-800 rounded-md">
                  <h3 className="font-bold">Error</h3>
                  <p>{error}</p>
                </div>
              )}

              <div>
                <h3 className="font-bold mb-2">Environment Variables</h3>
                <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto">{JSON.stringify(envVars, null, 2)}</pre>
              </div>

              <div>
                <h3 className="font-bold mb-2">Cookies</h3>
                <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto whitespace-pre-wrap">
                  {cookies || "No cookies found"}
                </pre>
              </div>

              <div>
                <h3 className="font-bold mb-2">Session</h3>
                <pre className="p-4 bg-gray-100 rounded-md overflow-x-auto">
                  {session ? JSON.stringify(session, null, 2) : "No active session"}
                </pre>
              </div>

              {session && (
                <Button onClick={handleSignOut} variant="destructive">
                  Sign Out
                </Button>
              )}

              <div className="mt-4">
                <h3 className="font-bold mb-2">Navigation</h3>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <a href="/auth/login">Go to Login</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/dashboard">Go to Dashboard</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/">Go to Home</a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
