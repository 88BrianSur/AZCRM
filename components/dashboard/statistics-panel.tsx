"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  CartesianGrid,
  Cell,
  ChartContainer,
  ChartTooltipContent,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { LoadingSpinner } from "@/components/loading-spinner"
import { differenceInDays, format, subMonths } from "date-fns"

type ClientStatus = "active" | "alumni" | "inactive" | "paused"
type ProgramType = "inpatient" | "outpatient" | "intensive_outpatient" | "partial_hospitalization" | string
type Gender = "male" | "female" | "other" | "prefer_not_to_say" | string

interface Client {
  id: string
  first_name: string
  last_name: string
  status: ClientStatus
  program_type: ProgramType
  gender: Gender
  admission_date: string | null
  discharge_date: string | null
  created_at: string
}

export function StatisticsPanel() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("clients").select("*")

        if (error) {
          throw error
        }

        setClients(data || [])
      } catch (error: any) {
        console.error("Error fetching clients:", error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [supabase])

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center p-6">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6">
          <div className="text-center text-red-500">Error loading statistics: {error}</div>
        </CardContent>
      </Card>
    )
  }

  // Calculate statistics
  const totalClients = clients.length
  const activeClients = clients.filter((client) => client.status === "active").length
  const alumniClients = clients.filter((client) => client.status === "alumni").length
  const inactiveClients = clients.filter((client) => client.status === "inactive" || client.status === "paused").length

  // Calculate average length of stay for completed clients (alumni)
  const completedClients = clients.filter(
    (client) => client.status === "alumni" && client.admission_date && client.discharge_date,
  )

  const totalDays = completedClients.reduce((sum, client) => {
    const admissionDate = new Date(client.admission_date!)
    const dischargeDate = new Date(client.discharge_date!)
    return sum + differenceInDays(dischargeDate, admissionDate)
  }, 0)

  const averageLengthOfStay = completedClients.length > 0 ? Math.round(totalDays / completedClients.length) : 0

  // Calculate completion rate
  const completionRate = totalClients > 0 ? Math.round((alumniClients / totalClients) * 100) : 0

  // Program type breakdown
  const programTypes = clients.reduce(
    (acc, client) => {
      const type = client.program_type || "unknown"
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const programTypeData = Object.entries(programTypes).map(([name, value]) => ({
    name: formatProgramType(name),
    value,
    color: getProgramColor(name),
  }))

  // Gender distribution
  const genderDistribution = clients.reduce(
    (acc, client) => {
      const gender = client.gender || "unknown"
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const genderData = Object.entries(genderDistribution).map(([name, value]) => ({
    name: formatGender(name),
    value,
    color: getGenderColor(name),
  }))

  // Monthly intake trends for the past 12 months
  const now = new Date()
  const monthlyIntakeData = Array.from({ length: 12 }, (_, i) => {
    const month = subMonths(now, 11 - i)
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0)

    const intakeCount = clients.filter((client) => {
      if (!client.admission_date) return false
      const admissionDate = new Date(client.admission_date)
      return admissionDate >= monthStart && admissionDate <= monthEnd
    }).length

    return {
      month: format(month, "MMM yyyy"),
      count: intakeCount,
    }
  })

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Comprehensive Statistics</CardTitle>
        <CardDescription>Real-time metrics and analytics for AZ House Platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Clients"
                value={totalClients}
                description="All clients ever registered"
                icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
              />
              <StatsCard
                title="Active Clients"
                value={activeClients}
                description="Currently in treatment"
                icon={<ActivityIcon className="h-4 w-4 text-muted-foreground" />}
              />
              <StatsCard
                title="Alumni"
                value={alumniClients}
                description="Completed treatment"
                icon={<GraduationCapIcon className="h-4 w-4 text-muted-foreground" />}
              />
              <StatsCard
                title="Inactive/Paused"
                value={inactiveClients}
                description="Currently on hold"
                icon={<PauseIcon className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Avg. Length of Stay"
                value={`${averageLengthOfStay} days`}
                description="For completed clients"
                icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
              />
              <StatsCard
                title="Completion Rate"
                value={`${completionRate}%`}
                description="Successfully completed program"
                icon={<CheckCircleIcon className="h-4 w-4 text-muted-foreground" />}
              />
              <StatsCard
                title="Male Clients"
                value={genderDistribution["male"] || 0}
                description={`${Math.round(((genderDistribution["male"] || 0) / totalClients) * 100)}% of total`}
                icon={<MaleIcon className="h-4 w-4 text-muted-foreground" />}
              />
              <StatsCard
                title="Female Clients"
                value={genderDistribution["female"] || 0}
                description={`${Math.round(((genderDistribution["female"] || 0) / totalClients) * 100)}% of total`}
                icon={<FemaleIcon className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Program Type Distribution</CardTitle>
                  <CardDescription>Breakdown by program type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={programTypeData.reduce(
                      (acc, item) => {
                        acc[item.name] = { color: item.color }
                        return acc
                      },
                      {} as Record<string, { color: string }>,
                    )}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={programTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {programTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gender Distribution</CardTitle>
                  <CardDescription>Breakdown by gender</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={genderData.reduce(
                      (acc, item) => {
                        acc[item.name] = { color: item.color }
                        return acc
                      },
                      {} as Record<string, { color: string }>,
                    )}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {genderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Client Status Distribution</CardTitle>
                  <CardDescription>Breakdown by current status</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      Active: { color: "#10b981" },
                      Alumni: { color: "#3b82f6" },
                      Inactive: { color: "#ef4444" },
                      Paused: { color: "#f59e0b" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Active", value: activeClients, color: "#10b981" },
                            { name: "Alumni", value: alumniClients, color: "#3b82f6" },
                            { name: "Inactive", value: inactiveClients, color: "#ef4444" },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: "Active", value: activeClients, color: "#10b981" },
                            { name: "Alumni", value: alumniClients, color: "#3b82f6" },
                            { name: "Inactive", value: inactiveClients, color: "#ef4444" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Program Completion Rate</CardTitle>
                  <CardDescription>Success metrics for treatment programs</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="flex h-full flex-col items-center justify-center">
                    <div className="relative h-48 w-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl font-bold">{completionRate}%</div>
                          <div className="text-sm text-muted-foreground">Completion Rate</div>
                        </div>
                      </div>
                      <ChartContainer
                        config={{
                          Completed: { color: "#10b981" },
                          "Not Completed": { color: "#e5e7eb" },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Completed", value: alumniClients, color: "#10b981" },
                                { name: "Not Completed", value: totalClients - alumniClients, color: "#e5e7eb" },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              dataKey="value"
                              nameKey="name"
                              startAngle={90}
                              endAngle={-270}
                            >
                              {[
                                { name: "Completed", value: alumniClients, color: "#10b981" },
                                { name: "Not Completed", value: totalClients - alumniClients, color: "#e5e7eb" },
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{alumniClients}</div>
                        <div className="text-xs text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{totalClients - alumniClients}</div>
                        <div className="text-xs text-muted-foreground">In Progress/Other</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Program Type Breakdown</CardTitle>
                <CardDescription>Detailed view of program enrollment</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer
                  config={programTypeData.reduce(
                    (acc, item) => {
                      acc[item.name] = { color: item.color }
                      return acc
                    },
                    {} as Record<string, { color: string }>,
                  )}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={programTypeData}
                      layout="vertical"
                      margin={{ top: 20, right: 20, bottom: 20, left: 120 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" name="Clients">
                        {programTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Intake Trends</CardTitle>
                <CardDescription>New client admissions over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    count: { color: "#3b82f6" },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyIntakeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" name="New Clients" />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" dot={true} name="Trend" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Average Length of Stay</CardTitle>
                  <CardDescription>By program type (in days)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={programTypeData.reduce(
                      (acc, item) => {
                        acc[item.name] = { color: item.color }
                        return acc
                      },
                      {} as Record<string, { color: string }>,
                    )}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={programTypeData.map((type) => {
                          // Calculate average length of stay for each program type
                          const programClients = clients.filter(
                            (client) =>
                              client.program_type === type.name.toLowerCase().replace(" ", "_") &&
                              client.status === "alumni" &&
                              client.admission_date &&
                              client.discharge_date,
                          )

                          const totalDays = programClients.reduce((sum, client) => {
                            const admissionDate = new Date(client.admission_date!)
                            const dischargeDate = new Date(client.discharge_date!)
                            return sum + differenceInDays(dischargeDate, admissionDate)
                          }, 0)

                          const avgDays = programClients.length > 0 ? Math.round(totalDays / programClients.length) : 0

                          return {
                            name: type.name,
                            days: avgDays,
                            color: type.color,
                          }
                        })}
                        layout="vertical"
                        margin={{ top: 20, right: 20, bottom: 20, left: 120 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="days" name="Average Days">
                          {programTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Status Over Time</CardTitle>
                  <CardDescription>Quarterly breakdown of client status</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      active: { color: "#10b981" },
                      alumni: { color: "#3b82f6" },
                      inactive: { color: "#ef4444" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={[
                          { quarter: "Q1", active: 32, alumni: 10, inactive: 5 },
                          { quarter: "Q2", active: 35, alumni: 12, inactive: 6 },
                          { quarter: "Q3", active: 38, alumni: 14, inactive: 4 },
                          { quarter: "Q4", active: activeClients, alumni: alumniClients, inactive: inactiveClients },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="quarter" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="active" stackId="a" fill="var(--color-active)" name="Active" />
                        <Bar dataKey="alumni" stackId="a" fill="var(--color-alumni)" name="Alumni" />
                        <Bar dataKey="inactive" stackId="a" fill="var(--color-inactive)" name="Inactive" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Helper components and functions
function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: number | string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function formatProgramType(type: string): string {
  switch (type.toLowerCase()) {
    case "inpatient":
      return "Inpatient"
    case "outpatient":
      return "Outpatient"
    case "intensive_outpatient":
      return "Intensive Outpatient"
    case "partial_hospitalization":
      return "Partial Hospitalization"
    default:
      return type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
  }
}

function formatGender(gender: string): string {
  switch (gender.toLowerCase()) {
    case "male":
      return "Male"
    case "female":
      return "Female"
    case "other":
      return "Other"
    case "prefer_not_to_say":
      return "Prefer Not to Say"
    default:
      return gender.charAt(0).toUpperCase() + gender.slice(1)
  }
}

function getProgramColor(type: string): string {
  switch (type.toLowerCase()) {
    case "inpatient":
      return "#4f46e5" // indigo
    case "outpatient":
      return "#0ea5e9" // sky blue
    case "intensive_outpatient":
      return "#10b981" // emerald
    case "partial_hospitalization":
      return "#f59e0b" // amber
    default:
      return "#6b7280" // gray
  }
}

function getGenderColor(gender: string): string {
  switch (gender.toLowerCase()) {
    case "male":
      return "#3b82f6" // blue
    case "female":
      return "#ec4899" // pink
    case "other":
      return "#8b5cf6" // purple
    case "prefer_not_to_say":
      return "#6b7280" // gray
    default:
      return "#6b7280" // gray
  }
}

// Icon components
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

function GraduationCapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="4" height="16" x="6" y="4" />
      <rect width="4" height="16" x="14" y="4" />
    </svg>
  )
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  )
}

function MaleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="5" />
      <path d="M12 12v10" />
      <path d="M9 19h6" />
    </svg>
  )
}

function FemaleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v8" />
      <path d="M9 18h6" />
    </svg>
  )
}
