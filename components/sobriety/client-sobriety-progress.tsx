"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart, registerables } from "chart.js"
import { Calendar, Clock, BarChart2, RefreshCw } from "lucide-react"

// Register all Chart.js components
Chart.register(...registerables)

interface ClientSobrietyProgressProps {
  client: any
}

export function ClientSobrietyProgress({ client }: ClientSobrietyProgressProps) {
  const progressChartRef = useRef<HTMLCanvasElement>(null)
  const historyChartRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState("progress")

  useEffect(() => {
    if (!client) return

    // Create progress chart
    if (progressChartRef.current) {
      const progressCtx = progressChartRef.current.getContext("2d")
      if (progressCtx) {
        const progressChart = new Chart(progressCtx, {
          type: "line",
          data: {
            labels: client.checkIns.map((checkIn: any) => {
              const date = new Date(checkIn.date)
              return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }),
            datasets: [
              {
                label: "Days Sober",
                data: client.checkIns.map((_: any, index: number) => index * 30 + 1), // Simplified calculation
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Days Sober",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Check-in Date",
                },
              },
            },
          },
        })

        return () => {
          progressChart.destroy()
        }
      }
    }
  }, [client, activeTab])

  useEffect(() => {
    if (!client || !client.history || activeTab !== "history") return

    // Create history chart
    if (historyChartRef.current) {
      const historyCtx = historyChartRef.current.getContext("2d")
      if (historyCtx) {
        const historyChart = new Chart(historyCtx, {
          type: "bar",
          data: {
            labels: client.history.map((period: any, index: number) => `Period ${index + 1}`),
            datasets: [
              {
                label: "Sobriety Period (Days)",
                data: client.history.map((period: any) => period.days),
                backgroundColor: "rgba(59, 130, 246, 0.7)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Days",
                },
              },
            },
          },
        })

        return () => {
          historyChart.destroy()
        }
      }
    }
  }, [client, activeTab])

  if (!client) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No client selected</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{client.days} days</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Started on {new Date(client.history[client.history.length - 1].startDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Milestone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{getNextMilestone(client.days).milestone}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In {getNextMilestone(client.days).days - client.days} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <RefreshCw className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{client.checkIns.length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last check-in: {new Date(client.checkIns[client.checkIns.length - 1].date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="progress">
            <BarChart2 className="mr-2 h-4 w-4" />
            Progress Chart
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="mr-2 h-4 w-4" />
            Sobriety History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sobriety Progress</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <canvas ref={progressChartRef} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sobriety History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <canvas ref={historyChartRef} />
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-medium">Detailed History</h3>
                {client.history.map((period: any, index: number) => (
                  <div key={index} className="flex items-center p-3 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">From:</span> {new Date(period.startDate).toLocaleDateString()}
                        {period.endDate ? (
                          <>
                            {" "}
                            <span className="font-medium">To:</span> {new Date(period.endDate).toLocaleDateString()}
                          </>
                        ) : (
                          " (Current)"
                        )}
                      </p>
                      <p className="text-sm font-medium">{period.days} days</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to get next milestone
function getNextMilestone(days: number) {
  const milestones = [
    { days: 7, milestone: "1 Week" },
    { days: 30, milestone: "30 Days" },
    { days: 60, milestone: "60 Days" },
    { days: 90, milestone: "90 Days" },
    { days: 180, milestone: "6 Months" },
    { days: 365, milestone: "1 Year" },
    { days: 730, milestone: "2 Years" },
    { days: 1095, milestone: "3 Years" },
  ]

  const nextMilestone = milestones.find((m) => m.days > days)

  if (nextMilestone) {
    return nextMilestone
  }

  // If beyond all predefined milestones, calculate next year milestone
  const nextYear = Math.ceil(days / 365)
  return { days: nextYear * 365, milestone: `${nextYear} Years` }
}
