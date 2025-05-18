"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"

export default function AuthTestPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setUser(data.session?.user || null)
      } catch (err) {
        console.error("Auth error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Authentication Test</h1>
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <p>Checking authentication...</p>
          ) : error ? (
            <div>
              <p className="text-red-500">Error: {error}</p>
              <p className="mt-2">This indicates there's an issue with authentication.</p>
            </div>
          ) : user ? (
            <div>
              <p className="text-green-500">Authentication successful!</p>
              <p className="mt-2">Logged in as: {user.email}</p>
              <p className="mt-2">User ID: {user.id}</p>
              <p className="mt-4">
                If you see this but the dashboard doesn't load, the issue is with the dashboard component, not
                authentication.
              </p>
            </div>
          ) : (
            <p>Not authenticated. Please log in.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
