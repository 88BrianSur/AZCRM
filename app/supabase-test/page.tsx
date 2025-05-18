"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export default function SupabaseTestPage() {
  const [status, setStatus] = useState("Testing connection...")
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClientSupabaseClient()

        // Test authentication
        const { data: authData, error: authError } = await supabase.auth.getSession()

        if (authError) {
          setError(`Auth error: ${authError.message}`)
          return
        }

        if (authData?.session) {
          setUser(authData.session.user)
        }

        // Test a simple query
        const { data, error: queryError } = await supabase
          .from("clients")
          .select("count(*)", { count: "exact", head: true })

        if (queryError) {
          setError(`Query error: ${queryError.message}`)
          return
        }

        setStatus("Connection successful!")
      } catch (e) {
        setError(`Exception: ${e.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>

      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            <strong>Status:</strong> {status}
          </p>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded mt-2">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {user && (
            <div className="mt-4">
              <h3 className="font-medium">Authenticated User:</h3>
              <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
