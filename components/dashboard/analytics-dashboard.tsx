"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  ChartContainer,
  ChartTooltipContent,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "@/components/ui/chart"
import { DateRangePicker } from "@/components/date-range-picker"

export function AnalyticsDashboard() {
  const [clientData, setClientData] = useState([])
  const [treatmentData, setTreatmentData] = useState([])
  const [outcomesData, setOutcomesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1), // Jan 1 of current year
    to: new Date(),
  })

  useEffect(() => {
    async function fetchAnalyticsData() {
      try {
        const supabase = createClientSupabaseClient()

        // Fetch client analytics data
        // Changed from admission_date to intake_date to match the actual column name
        const { data: clients, error: clientsError } = await supabase
          .from("clients")
          .select("intake_date, status")
          .order("intake_date", { ascending: true })

        if (clientsError) {
          console.error("Error fetching client data:", clientsError)
        } else {
          // Process client data for chart
          const processedClientData = processClientData(clients || [])
          setClientData(processedClientData)
        }

        // Fetch treatment data
        // This would typically come from a treatments or sessions table
        // For now, we'll generate mock data
        setTreatmentData(generateTreatmentData())

        // Fetch outcomes data
        // This would typically come from an outcomes or assessments table
        // For now, we'll generate mock data
        setOutcomesData(generateOutcomesData())
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  // Process client data for the chart
  // Updated to use intake_date instead of admission_date
  const processClientData = (clients) => {
    const monthlyData = {}

    clients.forEach((client) => {
      const date = new Date(client.intake_date)
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          name: monthYear,
          admissions: 0,
          active: 0,
          discharged: 0,
          completed: 0,
        }
      }

      monthlyData[monthYear].admissions += 1

      if (client.status === "Active") {
        monthlyData[monthYear].active += 1
      } else if (client.status === "Discharged") {
        monthlyData[monthYear].discharged += 1
      } else if (client.status === "Completed") {
        monthlyData[monthYear].completed += 1
      }
    })

    return Object.values(monthlyData)
  }

  // Generate mock treatment data
  const generateTreatmentData = () => {
    return [
      { name: "Week 1", individual: 12, group: 8, family: 4 },
      { name: "Week 2", individual: 15, group: 10, family: 6 },
      { name: "Week 3", individual: 18, group: 12, family: 5 },
      { name: "Week 4", individual: 16, group: 14, family: 7 },
      { name: "Week 5", individual: 20, group: 15, family: 8 },
      { name: "Week 6", individual: 22, group: 16, family: 9 },
    ]
  }

  // Generate mock outcomes data
  const generateOutcomesData = () => {
    return [
      { name: "Month 1", sobriety: 75, employment: 40, housing: 60 },
      { name: "Month 2", sobriety: 80, employment: 45, housing: 65 },
      { name: "Month 3", sobriety: 85, employment: 50, housing: 70 },
      { name: "Month 4", sobriety: 82, employment: 55, housing: 75 },
      { name: "Month 5", sobriety: 88, employment: 60, housing: 80 },
      { name: "Month 6", sobriety: 90, employment: 65, housing: 85 },
    ]
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <DateRangePicker date={{ from: dateRange.from, to: dateRange.to }} onDateChange={setDateRange} />
      </div>

      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Admissions & Status</CardTitle>
              <CardDescription>Monthly client admissions and current status.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  admissions: { color: "#8884d8" },
                  active: { color: "#82ca9d" },
                  discharged: { color: "#ffc658" },
                  completed: { color: "#ff7300" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={clientData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="admissions" fill="var(--color-admissions)" />
                    <Line type="monotone" dataKey="active" stroke="var(--color-active)" />
                    <Line type="monotone" dataKey="discharged" stroke="var(--color-discharged)" />
                    <Line type="monotone" dataKey="completed" stroke="var(--color-completed)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treatment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Sessions</CardTitle>
              <CardDescription>Weekly treatment sessions by type.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  individual: { color: "#8884d8" },
                  group: { color: "#82ca9d" },
                  family: { color: "#ffc658" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={treatmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="individual" fill="var(--color-individual)" />
                    <Bar dataKey="group" fill="var(--color-group)" />
                    <Bar dataKey="family" fill="var(--color-family)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Outcomes</CardTitle>
              <CardDescription>Monthly client outcomes by category.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  sobriety: { color: "#8884d8" },
                  employment: { color: "#82ca9d" },
                  housing: { color: "#ffc658" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={outcomesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="sobriety" stroke="var(--color-sobriety)" />
                    <Line type="monotone" dataKey="employment" stroke="var(--color-employment)" />
                    <Line type="monotone" dataKey="housing" stroke="var(--color-housing)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
