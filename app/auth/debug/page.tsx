"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function AuthDebugPage() {
  const [results, setResults] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setIsLoading(true)
    const diagnostics: any = {}

    try {
      // 1. Environment Variables
      diagnostics.environment = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      }

      // 2. Browser Information
      diagnostics.browser = {
        userAgent: navigator.userAgent,
        cookiesEnabled: navigator.cookieEnabled,
        currentUrl: window.location.href,
        origin: window.location.origin,
        protocol: window.location.protocol,
        cookies: document.cookie,
      }

      // 3. Supabase Client Test
      if (diagnostics.environment.hasUrl && diagnostics.environment.hasKey) {
        try {
          const supabase = getSupabaseClient()
          diagnostics.supabaseClient = {
            created: true,
            error: null,
          }

          // 4. Session Test
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
          diagnostics.session = {
            hasSession: !!sessionData.session,
            error: sessionError?.message || null,
            user: sessionData.session?.user?.email || null,
          }

          // 5. Authentication Test
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: "admin@example.com",
            password: "password123",
          })

          diagnostics.authentication = {
            success: !authError && !!authData.user,
            error: authError?.message || null,
            hasUser: !!authData.user,
            hasSession: !!authData.session,
            userEmail: authData.user?.email || null,
          }

          // 6. Post-Auth Session Check
          if (diagnostics.authentication.success) {
            const { data: postAuthSession } = await supabase.auth.getSession()
            diagnostics.postAuthSession = {
              hasSession: !!postAuthSession.session,
              userEmail: postAuthSession.session?.user?.email || null,
            }
          }
        } catch (err) {
          diagnostics.supabaseClient = {
            created: false,
            error: err instanceof Error ? err.message : String(err),
          }
        }
      } else {
        diagnostics.supabaseClient = {
          created: false,
          error: "Missing environment variables",
        }
      }
    } catch (err) {
      diagnostics.error = err instanceof Error ? err.message : String(err)
    }

    setResults(diagnostics)
    setIsLoading(false)
  }

  const signOut = async () => {
    try {
      const supabase = getSupabaseClient()
      await supabase.auth.signOut()
      await runDiagnostics()
    } catch (err) {
      console.error("Sign out error:", err)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug Dashboard</CardTitle>
          <div className="flex gap-2">
            <Button onClick={runDiagnostics} disabled={isLoading}>
              {isLoading ? "Running..." : "Run Diagnostics"}
            </Button>
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
            <Button asChild variant="outline">
              <a href="/auth/login">Go to Login</a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(results).map(([key, value]) => (
            <Alert key={key}>
              <AlertDescription>
                <h3 className="font-semibold mb-2 capitalize">{key.replace(/([A-Z])/g, " $1")}</h3>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
