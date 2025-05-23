"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { StatisticsPanel } from "@/components/dashboard/statistics-panel"
import { AlertsWidget } from "@/components/dashboard/alerts-widget"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"
import { ReportsDashboard } from "@/components/dashboard/reports-dashboard"
import { NotificationsDashboard } from "@/components/dashboard/notifications-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalNotes: 0,
    upcomingAppointments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createClientSupabaseClient()

        // Fetch clients count
        const { count: totalClients, error: clientsError } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true })

        if (clientsError) {
          throw new Error(`Error fetching clients: ${clientsError.message}`)
        }

        // Fetch active clients count
        const { count: activeClients, error: activeClientsError } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .eq("status", "Active")

        if (activeClientsError) {
          throw new Error(`Error fetching active clients: ${activeClientsError.message}`)
        }

        // Fetch notes count
        const { count: totalNotes, error: notesError } = await supabase
          .from("notes")
          .select("*", { count: "exact", head: true })

        if (notesError) {
          throw new Error(`Error fetching notes: ${notesError.message}`)
        }

        // Fetch upcoming appointments count
        const { count: upcomingAppointments, error: appointmentsError } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .gte("appointment_date", new Date().toISOString())

        if (appointmentsError) {
          throw new Error(`Error fetching appointments: ${appointmentsError.message}`)
        }

        setStats({
          totalClients: totalClients || 0,
          activeClients: activeClients || 0,
          totalNotes: totalNotes || 0,
          upcomingAppointments: upcomingAppointments || 0,
        })
      } catch (err) {
        console.error("Dashboard data fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <Card>
          <CardContent className="p-6">
            <div className="text-red-500">Error loading dashboard: {error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <StatisticsPanel stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent activities and updates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="analytics">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="analytics" className="space-y-4">
                <AnalyticsDashboard />
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <ReportsDashboard />
              </TabsContent>
              <TabsContent value="notifications" className="space-y-4">
                <NotificationsDashboard />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <AlertsWidget />
      </div>
    </div>
  )
}
