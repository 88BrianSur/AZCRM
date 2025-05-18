"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SobrietyChart } from "@/components/sobriety/sobriety-chart"
import { SobrietyStats } from "@/components/sobriety/sobriety-stats"
import { ClientSobrietyProgress } from "@/components/sobriety/client-sobriety-progress"
import { DetailedSobrietyMetrics } from "@/components/sobriety/detailed-sobriety-metrics"
import { CheckInForm } from "@/components/sobriety/check-in-form"
import { SobrietyHeatmap } from "@/components/sobriety/sobriety-heatmap"
import { MilestoneProgress } from "@/components/sobriety/milestone-progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"
import { PlusCircle, RefreshCw } from "lucide-react"

export default function SobrietyTrackerPage() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [showCheckInForm, setShowCheckInForm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchClients() {
      setLoading(true)
      try {
        const supabase = createClientComponentClient<Database>()
        const { data, error } = await supabase
          .from("clients")
          .select("id, first_name, last_name, current_streak, longest_streak")
          .order("last_name", { ascending: true })

        if (error) {
          throw error
        }

        setClients(data || [])
        if (data && data.length > 0) {
          setSelectedClientId(data[0].id)
        }
      } catch (error) {
        console.error("Error fetching clients:", error)
        toast({
          title: "Error",
          description: "Failed to load clients",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [toast])

  const handleRefresh = () => {
    // Reload the page to refresh data
    window.location.reload()
  }

  const handleCheckInSuccess = () => {
    setShowCheckInForm(false)
    handleRefresh()
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block mb-4">
            <LoadingSpinner size="lg" />
          </div>
          <p className="text-muted-foreground">Loading sobriety tracker...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title="Sobriety Tracker"
        description="Monitor and manage client sobriety progress"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button onClick={() => setShowCheckInForm(!showCheckInForm)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {showCheckInForm ? "Hide Check-in Form" : "New Check-in"}
            </Button>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-64">
          <Card>
            <CardHeader>
              <CardTitle>Select Client</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.first_name} {client.last_name}
                      {client.current_streak > 0 && ` (${client.current_streak} days)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {showCheckInForm && selectedClientId && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Record Check-in</h3>
                  <CheckInForm clientId={selectedClientId} onSuccess={handleCheckInSuccess} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          {selectedClientId ? (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="overview">Program Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-0">
                <DetailedSobrietyMetrics clientId={selectedClientId} />
              </TabsContent>

              <TabsContent value="progress" className="mt-0">
                <ClientSobrietyProgress client={clients.find((c) => c.id === selectedClientId)} />
              </TabsContent>

              <TabsContent value="calendar" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SobrietyHeatmap
                    logs={[]} // This will be populated from the server component
                    onSelectDate={(date, log) => {
                      console.log("Selected date:", date, log)
                      // Handle date selection
                    }}
                  />

                  <MilestoneProgress
                    currentStreak={clients.find((c) => c.id === selectedClientId)?.current_streak || 0}
                    longestStreak={clients.find((c) => c.id === selectedClientId)?.longest_streak || 0}
                  />
                </div>
              </TabsContent>

              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Program Sobriety Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <SobrietyChart clients={clients} />
                    </CardContent>
                  </Card>

                  <SobrietyStats clients={clients} />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">Select a client to view sobriety data</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
